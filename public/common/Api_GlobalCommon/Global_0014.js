
// CXCL0014 接口参数全局变量



/**
 * accNotp - 0670 - 账号类型
 * 1:活期
 * 2：定期
 * '空值':所有
 */
export const acctNoTpObj = {
    1: '1',
    2: '2',
    '': ''
}
/**
 * cntnDepFlg - 0680 - 续存标志
 * Y：可以
 * N：不可以
 * 空值：不可以
 */
export const cntnDepFlgObj = {
    Y: 'Y',
    N: 'N',
    '': ''
}
/**
 * acctStFlg - 0690 - 账户状态标志
 * 1:不返回已销户账户  
 * 空值:返回所有账户
 */

export const acctStFlgObj = {
    1: '',
    '': ''
}

/**
 * 是否返回海惠通信息，默认不返回
 * 0700  hhtFlg
 * 1是
 * 0否
 */

export const hhtFlgObj = {
    1: '1',
    0: '0'
}