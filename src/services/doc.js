import request from '@/utils/request';

export const getDocs = params =>
  request.get('/v1/docs', {
    params,
  });

export const getDocsById = params =>
  request.get('/v1/docs/stars', {
    params,
  });

