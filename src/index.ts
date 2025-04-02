import { basekit, t, ActionComponent, ActionCode, ActionResultType } from '@lark-base-open/faas-sdk';

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(['api.exchangerate-api.com']);

basekit.addAction({
  id: 'rmb-usd-rate',
  name: t('name'),
  desc: t('desc'),
  // 定义捷径的i18n语言资源
  i18n: {
    messages: {
      'zh-CN': {
        'name': '人民币转美元汇率',
        'desc': '将人民币金额转换为美元金额',
        'rmb': '人民币金额',
        'usd': '美元金额',
        'rate': '汇率',
      },
      'en-US': {
        'name': 'RMB to USD conversion rate',
        'desc': 'Convert RMB amount to USD amount',
        'rmb': 'RMB Amount',
        'usd': 'Dollar amount',
        'rate': 'Exchange Rate',
      },
      'ja-JP': {
        'name': '人民元から米ドルへの為替レート',
        'desc': '日本円の金額をドルに換算する為替レートを取得します',
        'rmb': '人民元の金額',
        'usd': 'ドル金額',
        'rate': '為替レート',
      },
    }
  },
  // 定义捷径的入参
  formItems: [
    {
      key: 'account',
      label: t('rmb'),
      component: ActionComponent.NumberInput,
      props: {},
      validator: {
        required: true,
      }
    },
  ],
  // 定义捷径的返回结果类型
  resultType: {
    type: ActionResultType.Object,
    extra: {
      properties: [
        {
          key: 'usd',
          type: ActionResultType.Number,
          label: t('usd'),
        },
        {
          key: 'rate',
          type: ActionResultType.Number,
          label: t('rate'),
        },
      ],
    },
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams: { account: number }, context) => {
    const { account = 0 } = formItemParams;
    /** 为方便查看日志，使用此方法替代console.log */
    function debugLog(arg: any) {
      console.log(JSON.stringify({
        formItemParams,
        context,
        arg
      }))
    }
    try {
      const res = await context.fetch('https://api.exchangerate-api.com/v4/latest/CNY', { // 已经在addDomainList中添加为白名单的请求
        method: 'GET',
      }).then(res => res.json());
      const usdRate = res?.rates?.['USD'];
      return {
        code: ActionCode.Success,
        data: {
          usd: parseFloat((account * usdRate).toFixed(4)),
          rate: usdRate,
        }
      }
    } catch (e) {
      console.log('====error', String(e));
      debugLog(e);
      return {
        code: ActionCode.Error,
        msg: e?.message,
      }
    }
  },
});

export default basekit;