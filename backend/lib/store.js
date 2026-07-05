const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── query matcher ──────────────────────────────────────────────
function matches(doc, query) {
  // $or at top level
  if (query.$or) {
    return query.$or.some(subQuery => matches(doc, subQuery));
  }

  return Object.entries(query).every(([key, val]) => {
    if (key === '$or') return true; // handled above

    if (val && typeof val === 'object' && !Array.isArray(val)) {
      // Operator object: { $regex, $options, $in, $gte, $lte, $ne, $all }
      if (val.$regex) {
        const re = val.$regex instanceof RegExp ? val.$regex : new RegExp(val.$regex, val.$options || 'i');
        return re.test(String(doc[key] || ''));
      }
      if (val.$in) {
        return val.$in.includes(doc[key]);
      }
      if (val.$nin) {
        return !val.$nin.includes(doc[key]);
      }
      if (val.$ne !== undefined) {
        return doc[key] !== val.$ne;
      }
      if (val.$gte !== undefined) {
        return (doc[key] || 0) >= val.$gte;
      }
      if (val.$lte !== undefined) {
        return (doc[key] || 0) <= val.$lte;
      }
      if (val.$gt !== undefined) {
        return (doc[key] || 0) > val.$gt;
      }
      if (val.$lt !== undefined) {
        return (doc[key] || 0) < val.$lt;
      }
      if (val.$all) {
        const docArr = Array.isArray(doc[key]) ? doc[key] : [];
        return val.$all.every(v => docArr.includes(v));
      }
      if (val.$elemMatch) {
        // $elemMatch on array of objects
        const docArr = Array.isArray(doc[key]) ? doc[key] : [];
        return docArr.some(elem => matches(elem, val.$elemMatch));
      }
    }

    // Direct value equality
    return doc[key] === val;
  });
}

// ── sort helper ────────────────────────────────────────────────
function applySort(docs, sortObj) {
  if (!sortObj || Object.keys(sortObj).length === 0) return;
  const entries = Object.entries(sortObj);
  docs.sort((a, b) => {
    for (const [key, order] of entries) {
      const av = a[key] ?? 0;
      const bv = b[key] ?? 0;
      if (av < bv) return order === -1 ? 1 : -1;
      if (av > bv) return order === -1 ? -1 : 1;
    }
    return 0;
  });
}

// ── select helper ──────────────────────────────────────────────
function applySelect(doc, selectStr) {
  if (!selectStr || !doc) return doc;
  // '+field' means force-include (since we store everything, it's a no-op)
  if (selectStr.startsWith('+')) return { ...doc };
  // '-field1 -field2' means exclude these fields
  const excludeFields = selectStr.split(/\s+/).filter(f => f.startsWith('-')).map(f => f.slice(1));
  if (excludeFields.length === 0) return { ...doc };
  const result = { ...doc };
  excludeFields.forEach(f => delete result[f]);
  return result;
}

// ── populate helper ────────────────────────────────────────────
async function applyPopulates(docs, populates) {
  if (!populates || populates.length === 0) return;
  // Lazy-require to avoid circular deps
  const { model } = require('./db');

  for (const pop of populates) {
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const refId = doc[pop.field];
      if (!refId) continue;

      let idStr;
      if (typeof refId === 'object' && refId !== null) {
        idStr = refId._id ? refId._id.toString() : refId.toString();
      } else {
        idStr = refId.toString();
      }

      // Determine which collection to query
      let collectionName;
      if (pop.field === 'user') {
        collectionName = 'User';
      } else if (pop.field === 'item') {
        // Use itemModel field or default
        const itemModel = doc.itemModel || 'TourPackage';
        collectionName = itemModel;
      } else if (pop.field === 'customer') {
        collectionName = 'User';
      } else {
        collectionName = pop.field.charAt(0).toUpperCase() + pop.field.slice(1);
      }

      try {
        const popModel = model(collectionName);
        const populated = await popModel.findById(idStr);
        if (populated && pop.select) {
          doc[pop.field] = applySelect(populated, pop.select);
        } else {
          doc[pop.field] = populated;
        }
      } catch (e) {
        // Model might not exist - keep original value
        doc[pop.field] = null;
      }
    }
  }
}

// ── aggregate helper ───────────────────────────────────────────
function aggregate(docs, pipeline) {
  let results = docs;
  for (const stage of pipeline) {
    // $match stage
    if (stage.$match) {
      results = results.filter(doc => matches(doc, stage.$match));
    }
    // $group stage
    if (stage.$group) {
      const { _id, ...accumulators } = stage.$group;
      const groups = {};

      for (const doc of results) {
        // Compute group key
        let key;
        if (_id === null || _id === 'null') {
          key = '__null__';
        } else if (typeof _id === 'object') {
          // { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }
          key = JSON.stringify(
            Object.fromEntries(
              Object.entries(_id).map(([k, expr]) => {
                if (expr.$year) {
                  const dateField = expr.$year.replace('$', '');
                  const d = new Date(doc[dateField]);
                  return [k, d.getFullYear()];
                }
                if (expr.$month) {
                  const dateField = expr.$month.replace('$', '');
                  const d = new Date(doc[dateField]);
                  return [k, d.getMonth() + 1];
                }
                return [k, doc[expr.replace('$', '')] || expr];
              })
            )
          );
        } else {
          key = String(doc[_id.replace('$', '')] || _id);
        }

        if (!groups[key]) {
          groups[key] = {
            _id: key === '__null__' ? null : JSON.parse(key),
            ...Object.fromEntries(
              Object.entries(accumulators).map(([ak]) => [ak, null])
            ),
          };
        }

        // Apply accumulators
        for (const [ak, aexpr] of Object.entries(accumulators)) {
          if (aexpr.$sum) {
            if (aexpr.$sum === 1) {
              groups[key][ak] = (groups[key][ak] || 0) + 1;
            } else {
              const fieldName = aexpr.$sum.replace('$', '');
              groups[key][ak] = (groups[key][ak] || 0) + (Number(doc[fieldName]) || 0);
            }
          }
        }
      }

      results = Object.values(groups);
    }
    // $sort stage  
    if (stage.$sort) {
      applySort(results, stage.$sort);
    }
  }
  return results;
}

// ── Collection class ───────────────────────────────────────────
class Collection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name.toLowerCase()}.json`);
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]', 'utf-8');
    }
  }

  _readAll() {
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  _writeAll(docs) {
    fs.writeFileSync(this.filePath, JSON.stringify(docs, null, 2), 'utf-8');
    return docs;
  }

  // ── find (chainable) ────────────────────────────────────────
  find(query = {}) {
    let docs = this._readAll();
    if (Object.keys(query).length > 0) {
      docs = docs.filter(doc => matches(doc, query));
    }
    const self = this;
    return {
      _docs: docs,
      _populates: [],
      _select: null,

      sort(sortObj) {
        applySort(this._docs, sortObj);
        return this;
      },
      skip(n) { this._docs = this._docs.slice(n); return this; },
      limit(n) { this._docs = this._docs.slice(0, n); return this; },
      lean() { return this; },
      select(fields) { this._select = fields; return this; },

      populate(field, select) {
        this._populates.push({ field, select });
        return this;
      },

      async exec() {
        await applyPopulates(this._docs, this._populates);
        if (this._select) {
          this._docs = this._docs.map(d => applySelect(d, this._select));
        }
        return this._docs;
      },

      async countDocuments() { return this._docs.length; },
    };
  }

  // ── findById (chainable for .select support) ─────────────────
  async findById(id) {
    const docs = this._readAll();
    const doc = docs.find(d => d._id === id) || null;
    return makeChainableSingle(doc);
  }

  // ── findOne (chainable for .select support) ──────────────────
  async findOne(query) {
    const docs = this._readAll();
    const doc = docs.find(d => matches(d, query)) || null;
    return makeChainableSingle(doc);
  }

  // ── create ───────────────────────────────────────────────────
  async create(data) {
    const docs = this._readAll();
    const doc = {
      _id: crypto.randomUUID(),
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    docs.push(doc);
    this._writeAll(docs);
    return { ...doc, _id: doc._id, toObject: () => ({ ...doc }) };
  }

  // ── findByIdAndUpdate ───────────────────────────────────────
  async findByIdAndUpdate(id, update, opts = { new: true }) {
    const docs = this._readAll();
    const idx = docs.findIndex(d => d._id === id);
    if (idx === -1) return null;
    if (update.$set) {
      docs[idx] = { ...docs[idx], ...update.$set, updatedAt: new Date().toISOString() };
    } else {
      const { $set, ...rest } = update;
      docs[idx] = { ...docs[idx], ...rest, updatedAt: new Date().toISOString() };
    }
    this._writeAll(docs);
    const result = { ...docs[idx], toObject: () => ({ ...docs[idx] }) };
    return result;
  }

  // ── findOneAndUpdate ────────────────────────────────────────
  async findOneAndUpdate(query, update, opts = { new: true }) {
    const docs = this._readAll();
    const idx = docs.findIndex(d => matches(d, query));
    if (idx === -1) return null;
    if (update.$set) {
      docs[idx] = { ...docs[idx], ...update.$set, updatedAt: new Date().toISOString() };
    } else {
      const { $set, ...rest } = update;
      docs[idx] = { ...docs[idx], ...rest, updatedAt: new Date().toISOString() };
    }
    this._writeAll(docs);
    return { ...docs[idx], toObject: () => ({ ...docs[idx] }) };
  }

  // ── findByIdAndDelete ───────────────────────────────────────
  async findByIdAndDelete(id) {
    const docs = this._readAll();
    const idx = docs.findIndex(d => d._id === id);
    if (idx === -1) return null;
    const deleted = docs[idx];
    docs.splice(idx, 1);
    this._writeAll(docs);
    return deleted;
  }

  // ── findOneAndDelete ────────────────────────────────────────
  async findOneAndDelete(query) {
    const docs = this._readAll();
    const idx = docs.findIndex(d => matches(d, query));
    if (idx === -1) return null;
    const deleted = docs[idx];
    docs.splice(idx, 1);
    this._writeAll(docs);
    return deleted;
  }

  // ── countDocuments ──────────────────────────────────────────
  async countDocuments(query = {}) {
    if (Object.keys(query).length === 0) {
      return this._readAll().length;
    }
    return this._readAll().filter(d => matches(d, query)).length;
  }

  // ── aggregate ───────────────────────────────────────────────
  async aggregate(pipeline) {
    const docs = this._readAll();
    return aggregate(docs, pipeline);
  }

  // ── insertMany ──────────────────────────────────────────────
  async insertMany(arr) {
    const docs = this._readAll();
    const newDocs = arr.map(data => ({
      _id: crypto.randomUUID(),
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    docs.push(...newDocs);
    this._writeAll(docs);
    return newDocs;
  }

  // ── deleteMany ──────────────────────────────────────────────
  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      this._writeAll([]);
      return { deletedCount: this._readAll().length };
    }
    const docs = this._readAll();
    const before = docs.length;
    const remaining = docs.filter(d => !matches(d, query));
    this._writeAll(remaining);
    return { deletedCount: before - remaining.length };
  }
}

// ── Chainable wrapper for single-doc operations ────────────────
function makeChainableSingle(doc) {
  return {
    _doc: doc,
    _select: null,
    select(fields) { this._select = fields; return this; },
    lean() { return this; },
    async exec() {
      if (this._select && this._doc) {
        return applySelect(this._doc, this._select);
      }
      return this._doc;
    },
    then(resolve) {
      return Promise.resolve(this.exec()).then(resolve);
    },
  };
}

module.exports = { Collection };
