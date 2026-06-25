import { Router } from 'express';
import indexRoutes from './index';

const router = Router();

router.use('/', indexRoutes);

// Route modules will be mounted here in next steps:
// router.use('/auth', authRoutes);
// router.use('/tours', tourRoutes);
// router.use('/bookings', bookingRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/admin', adminRoutes);
// router.use('/search', searchRoutes);
// router.use('/telegram', telegramRoutes);

export default router;
