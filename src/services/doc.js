import request from '@/utils/request';

export const getDocs = params => request.get('https://mock.com/docs', {
  params,
});
