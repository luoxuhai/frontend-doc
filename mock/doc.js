import Mock from 'mockjs';

const logos = [
  'https://cdn.docschina.org/img/assets/img/logo/rxjs-4b9b55.png',
  'https://big-frontend.oss-cn-beijing.aliyuncs.com/docs/logos/1569381378783.png',
  'https://big-frontend.oss-cn-beijing.aliyuncs.com/docs/logos/1569381380334.png',
];
const url = [
  'https://reactnative.cn/',
  'https://vue.docschina.org/',
  'https://weex.apache.org/zh/guide/introduction.html',
];

export const doc = Mock.mock('https://mock.com/docs', (options) => {
  console.log();
  return Mock.mock({
    'docs|10-50': [
      {
        '_id|+1': 100,
        name: '@cname',
        'describe|3-4': '@csentence',
        'logo|1': logos,
        'url|1': url,
      },
    ],
    'per_page': 10,
    'total': 10,
  });
});
