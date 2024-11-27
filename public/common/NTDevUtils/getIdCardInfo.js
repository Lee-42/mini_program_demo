import utils from "../../utils/utils";
let { formatTime } = utils
const NTDev = window.NTDev || parent.NTDev || {}
const { idCardReader } = NTDev
const getIdCardInfo = (options) => {
    const { success, fail } = options;
    if (idCardReader) {
        var outInfos = ""
        if (idCardReader.openDevice() == 0) {
            idCardReader.getIDType("", (error, type) => {
                console.log(type, "IDtype");
                // if (error != "成功！") return fail(error);
                switch (type) {
                    // 二代身份证
                    case "1":
                        idCardReader.getIdCardInfo("", (err, infos) => {
                            if (false) {
                                if (utils.isFunction(fail)) fail(err);
                            } else {
                                console.log(infos, "idInfos");
                                let infoSlt = infos.split("^_^");

                                outInfos = {
                                    chName: infoSlt[0],
                                    gender: infoSlt[1],
                                    nation: infoSlt[2],
                                    birth: infoSlt[3],
                                    address: infoSlt[4],
                                    idNum: infoSlt[5],
                                    issuingAuthority: infoSlt[6],
                                    startDate: formatTime(new Date([infoSlt[7].slice(0, 4), infoSlt[7].slice(4, 6), infoSlt[7].slice(6, 8)].join(",")), "yyyy-MM-dd"),
                                    endDate: formatTime(new Date([infoSlt[8].slice(0, 4), infoSlt[8].slice(4, 6), infoSlt[8].slice(6, 8)].join(",")), "yyyy-MM-dd"),
                                    avatar: infoSlt[9],
                                }
                                console.log(outInfos, "111111111");
                                console.log(utils.isFunction(success), "utils.isFunction(success)");
                                if (utils.isFunction(success)) success(outInfos);
                            }
                        })
                        break;
                    // 外国人永久居留证
                    case "2":
                        idCardReader.getForeginCardInfo("", (err, infos) => {
                            if (err) {
                                if (utils.isFunction(fail)) fail(err);
                            } else {
                                let infoSlt = infos.split("^_^");
                                outInfos = {
                                    enName: infoSlt[0],
                                    chName: infoSlt[1],
                                    gender: infoSlt[2],
                                    nationality: infoSlt[3],
                                    idNum: infoSlt[4],
                                    startDate: infoSlt[5],
                                    endDate: infoSlt[6],
                                    birth: infoSlt[7],
                                    version: infoSlt[8],
                                    issuingAuthority: infoSlt[9],
                                    idType: infoSlt[10],
                                    avatar: infoSlt[11],
                                }
                                if (utils.isFunction(success)) success(outInfos);
                            }

                        })
                        break;
                    // 港澳居民居住证
                    case "3":
                    // 台湾居民居住证
                    case "4":
                        idCardReader.getGATCardInfo("", (err, infos) => {
                            if (err) {
                                if (utils.isFunction(fail)) fail(err);
                            } else {
                                let infoSlt = infos.split("^_^");
                                outInfos = {
                                    chName: infoSlt[0],
                                    gender: infoSlt[1],
                                    birth: infoSlt[2],
                                    address: infoSlt[3],
                                    idNum: infoSlt[4],
                                    issuingAuthority: infoSlt[5],
                                    startDate: infoSlt[6],
                                    endDate: infoSlt[7],
                                    PassportNum: infoSlt[8],
                                    signTimes: infoSlt[9],
                                    idType: infoSlt[10],
                                    avatar: infoSlt[11],
                                    finger1: infoSlt[12],
                                    finger2: infoSlt[13],
                                    ASICSN: infoSlt[14],
                                    CardSN: infoSlt[15]
                                }
                                if (utils.isFunction(success)) success(outInfos);
                            }
                        })
                        break;
                    default:
                        break;
                }
                idCardReader.closeDevice();
            })
        }
        // if (outInfos) {
        //     return { res: true, data: outInfos };
        // } else {
        //     return { res: false };
        // }
    } else {
        console.error("当前系统没有外设驱动")
        if (utils.isFunction(fail)) fail("当前系统没有外设驱动");

    }
}

export default getIdCardInfo