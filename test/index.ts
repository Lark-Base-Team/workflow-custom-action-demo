import { testAction } from '@lark-base-open/faas-sdk';

async function run() {
  testAction({
    // 执行的 action id
    actionId: 'rmb-usd-rate',
    // execute 中的 formItemParams
    formItemParams: {
      account: 1
    },
    // execute 中的 context（fetch 已内置，无需在传入）
    context: {
      timeZone: 'Asia/Shanghai',
      tableID: '',
    }
  })
}

run();