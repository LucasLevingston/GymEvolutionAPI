import AbacatePay from 'abacatepay-nodejs-sdk';
import { env } from '@/env';

const { ABACATE_PAY_SECRET_KEY } = env;

export const abacatePay = AbacatePay(ABACATE_PAY_SECRET_KEY);
