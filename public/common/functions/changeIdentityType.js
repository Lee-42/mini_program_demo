const CORE_TO_BUSINESS_BANK_MAP = {
  "1": "P00",  //P00		1	身份证
  "2": "P07",  //P07		2	户口簿
  "3": "P05",  //P05		3	护照
  "4": "P01",  //P01      4	军人证  **
  "5": "P24",  //P24		5	回乡证
  "7": "P06",  //P06		7	港澳居民来往通行证
  "8": "E00",  //E00		8	组织机构代码证
  "9": "E14",  //E14		9	经营许可证
  "A": "E02",  //E02		A	营业执照
  "B": "E11",  //E11		B	事业法人证书
  "C": "E03",  //E03		C	工商核准号
  "D": "E99",  //E99		D	登记证书
  "E": "P10",  //P10		E	临时身份证
  "F": "P09",  //P09		F	外国人永久居留身份证
  "G": "P03",  //P03		G	警官证
  "H": "P99",  //P99		H	其他证件(对私)
  "K": "P02",  //P02		K	文职干部证
  "L": "P14",  //P14		L	军官退休证
  "M": "P15",  //P15		M	文职干部退休证
  "I": "P13",  //P13		I	台湾同胞来往通行证
  "N": "N",    //N		N	武警身份证
  "O": "P17",  //P17		O	武警士兵证
  "P": "P18",  //P18		P	武警文职干部证
  "Q": "P19",  //P19		Q	武警军官退休证
  "R": "P20",  //P20		R	武警文职干部退休证
  "W": "P25",  //P25		W	港澳居民居住证
  "Y": "P26",  //P26		Y   台湾居民居住证
  "S": "S",    //S		S	机构信用代码证
  "T": "T",    //T		T	贷款卡
  "U": "U",    //U		U	个体工商户营业执照
  "V": "E04",  //E04		V	文件
  "Z": "Z",    //Z		Z	验资户证件        
}

// 中文字典
const TYPE_ZH_MAP = {
  "1": "	身份证",
  "2": "	户口簿",
  "3": "	护照",
  "4": "	军人证  **",
  "5": "	回乡证",
  "7": "	港澳居民来往通行证",
  "8": "	组织机构代码证",
  "9": "	经营许可证",
  "A": "	营业执照",
  "B": "	事业法人证书",
  "C": "	工商核准号",
  "D": "	登记证书",
  "E": "	临时身份证",
  "F": "	外国人永久居留身份证",
  "G": "	警官证",
  "H": "	其他证件(对私)",
  "K": "	文职干部证",
  "L": "	军官退休证",
  "M": "	文职干部退休证",
  "I": "	台湾同胞来往通行证",
  "N": "	武警身份证",
  "O": "	武警士兵证",
  "P": "	武警文职干部证",
  "Q": "	武警军官退休证",
  "R": "	武警文职干部退休证",
  "W": "	港澳居民居住证",
  "Y": "   台湾居民居住证",
  "S": "	机构信用代码证",
  "T": "	贷款卡",
  "U": "	个体工商户营业执照",
  "V": "	文件",
  "Z": "	验资户证件 ",
}

/**
 * 证件类型的相互转换
 * 
 * @param {*} value 
 * @param {number} flag 默认是 1 - 将核心证件转换为其他渠道的证件类型，
 * 2 - 将其他渠道的证件类型转换为核心的证件类型
 * @param {string} mode BusinessBank (默认) | ECIF | CBP | EBP | EnterPriseCheck | NetIdentityCheck (大数据管理中心)
 * | EBP | EW (电子钱包)
 */
const changeIdentityType = (
  value,
  flag = 1,
  mode = "BusinessBank"
) => {
  let dic = null
  switch (mode) {
    case "BusinessBank":
      dic = CORE_TO_BUSINESS_BANK_MAP
      break;
    case "ECIF":
      dic = {
        "1": "10",  //10		1	身份证    
        "2": "40",  //40        2   户口簿
        "3": "50",  //50		3	护照
        "4": "20",  //20		4	军人证
        "5": "70",  //70		5	回乡证
        "6": "21",  //21		6	士兵证
        "F": "63",  //63		F	外国人永久居留身份证
        "7": "60",  //60		7	港澳居民来往通行证
        "I": "61",  //61		I	台湾同胞来往通行证
        "E": "62",  //62		E	临时身份证
        "W": "81",  //81		W	港澳居住证
        "Y": "82",  //82		Y	台湾居住证
        "G": "32",  //32		G	警官证
        "H": "80",  //80		H	其他证件(对私)
        "J": "22",  //22		J	军官证
        "K": "23",  //23		K	文职干部证
        "L": "24",  //24		L	军官退休证
        "M": "25",  //25		M	文职干部退休证
        "N": "30",  //30		N	武警身份证                 
        "O": "31",  //31		O	武警士兵证
        "P": "33",  //33		P	武警文职干部证
        "Q": "34",  //34		Q	武警军官退休证
        "R": "35",  //35		R	武警文职干部退休证
        "8": "01",  //01		8	组织机构代码证
        "9": "06",  //06		9	经营许可证
        "A": "03",  //03		A	营业执照
        "B": "07",  //07		B	事业法人证书
        "C": "08",  //08		C	工商核准号
        "D": "99",  //99		D	登记证书
        "U": "09",  //09	    U	个体工商户营业执照
        "S": "12",  //12		S	机构信用代码证                
        "V": "13",  //13		V	文件
        "Z": "11",  //11		Z	验资户证件   
      }
      break;
    case "CBP":
      dic = {
        "1": "01",  //10		1	身份证   
        "4": "02",  //02        4	军人证
        "3": "03",  //03		3	护照
        "7": "04",  //04		7	港澳居民来往通行证
        "I": "05",  //05		I	台湾同胞来往通行证
        "G": "06",  //06		G	警官证
        "2": "08",  //08		2	户口簿
        "E": "09",  //09		E	临时身份证
        "F": "10",  //10		F	外国人永久居留身份证
        "5": "99",  //99		5	回乡证
        "H": "99",  //99		H	其他证件(对私)
        "W": "99",  //99		W	港澳居民居住证
        "Y": "99",  //99		Y   台湾居民居住证
      }
      break;
    case "EBP":
      dic = {
        "1": "01",  //10		1	身份证   
        "4": "02",  //02        4	军人证
        "3": "04",  //04		3	护照
        "7": "06",  //06		7	港澳居民来往通行证
        "I": "07",  //07		I	台湾同胞来往通行证
        "G": "11",  //11		G	警官证
        "2": "11",  //11		2	户口簿
        "E": "11",  //11		E	临时身份证
        "F": "05",  //05		F	外国人永久居留身份证
        "5": "11",  //11		5	回乡证
        "H": "11",  //11		H	其他证件(对私)
        "W": "11",  //11		W	港澳居民居住证
        "Y": "11",  //11		Y   台湾居民居住证
      }
      break;
    case "EnterPriseCheck":
      dic = {
        "1": "IC00",  //		1	身份证   
        "4": "IC03",  //        4	军人证
        "3": "IC01",  //		3	护照
        "7": "IC04",  //		7	港澳居民来往通行证
        "I": "IC04",  //		I	台湾同胞来往通行证
        "G": "IC07",  //		G	警官证
        "2": "IC06",  //		2	户口簿
        "E": "IC05",  //		E	临时身份证
        "F": "IC08",  //		F	外国人永久居留身份证
        "5": "5",  //		5	回乡证
        "H": "H",  //		H	其他证件(对私)
        "W": "IC22",  //		W	港澳居民居住证
        "Y": "IC23",  //		Y   台湾居民居住证
      }
      break;
    case "NetIdentityCheck":
      dic = {
        "1": "111",   //111		1	身份证   
        "3": "414",   //414		3	护照
        "F": "553",   //553		F	外国人永久居留身份证
        "7": "516",   //516		7	港澳居民来往通行证
        "I": "511",   //511		I	台湾同胞来往通行证
      }
      break;
    case "EBP":
      break;
    case "EW":
      dic = {
        "1": "0102",  //0102		1	身份证    
        "2": "0300",  //0300        2   户口簿
        "3": "1202",  //1202		3	护照
        // "4": "20",  //20		4	军人证
        "5": "5",  //70		5	回乡证
        // "6": "21",  //21		6	士兵证
        "F": "1201",  //63		F	外国人永久居留身份证
        // "7": "60",  //60		7	港澳居民来往通行证
        "I": "1123",  //1123		I	台湾同胞来往通行证
        "E": "0200",  //62		E	临时身份证
        // "W": "81",  //81		W	港澳居住证
        "Y": "1133",  //1133		Y	台湾居住证
        "G": "0800",  //32		G	警官证
        // "H": "80",  //80		H	其他证件(对私)
        // "J": "22",  //22		J	军官证
        // "K": "23",  //23		K	文职干部证
        // "L": "24",  //24		L	军官退休证
        // "M": "25",  //25		M	文职干部退休证
        // "N": "30",  //30		N	武警身份证                 
        // "O": "31",  //31		O	武警士兵证
        // "P": "33",  //33		P	武警文职干部证
        // "Q": "34",  //34		Q	武警军官退休证
        // "R": "35",  //35		R	武警文职干部退休证
        "8": "2020",  //01		8	组织机构代码证
        // "9": "06",  //06		9	经营许可证
        "A": "2011",  //03		A	营业执照
        // "B": "07",  //07		B	事业法人证书
        // "C": "08",  //08		C	工商核准号
        // "D": "99",  //99		D	登记证书
        // "U": "09",  //09	    U	个体工商户营业执照
        // "S": "12",  //12		S	机构信用代码证                
        "V": "2999",  //13		V	文件
        // "Z": "11",  //11		Z	验资户证件  
      }
      break;
    case "EIF":
      dic = {
        "1": "10", //10		1	身份证    
        "2": "40", //40        2   户口簿
        "3": "50", //50		3	护照
        "4": "20", //20		4	军人证
        "5": "70", //70		5	回乡证
        "6": "21", //21		6	士兵证
        "F": "63", //63		F	外国人永久居留身份证
        "7": "60", //60		7	港澳居民来往通行证
        "I": "61", //61		I	台湾同胞来往通行证
        "E": "62", //62		E	临时身份证
        "W": "81", //81		W	港澳居住证
        "Y": "82", //82		Y	台湾居住证
        "G": "32", //32		G	警官证
        "H": "80", //80		H	其他证件(对私)
        "J": "22", //22		J	军官证
        "K": "23", //23		K	文职干部证
        "L": "24", //24		L	军官退休证
        "M": "25", //25		M	文职干部退休证
        "N": "30", //30		N	武警身份证                 
        "O": "31", //31		O	武警士兵证
        "P": "33", //33		P	武警文职干部证
        "Q": "34", //34		Q	武警军官退休证
        "R": "35", //35		R	武警文职干部退休证
        "8": "01", //01		8	组织机构代码证
        "9": "06", //06		9	经营许可证
        "A": "03", //03		A	营业执照
        "B": "07", //07		B	事业法人证书
        "C": "08", //08		C	工商核准号
        "D": "99", //99		D	登记证书
        "U": "09", //09	    U	个体工商户营业执照
        "S": "12", //12		S	机构信用代码证                
        "V": "13", //13		V	文件
        "Z": "11", //11		Z	验资户证件   
      }
    default:
      break;
  }

  if (dic !== null) {
    if (flag === 1) {
      if (value !== null) {
        if (Object.hasOwnProperty.call(dic, value)) {
          value = dic[value]
        } else {
          return value
        }
      } else {
        return ''
      }
    } else if (flag === 2) {
      const key = Object.keys(dic).find(key => dic[key] == value)
      if (key) {
        result = key
      } else {
        return value
      }
      // for (const key in dic) {
      //   if (Object.hasOwnProperty.call(dic, key)) {
      //     if (value === dic[key]) {
      //       value = key
      //       break
      //     }
      //   }
      // }
    }
  }
  return value
}

export default changeIdentityType
export {
  CORE_TO_BUSINESS_BANK_MAP,
  TYPE_ZH_MAP,
}