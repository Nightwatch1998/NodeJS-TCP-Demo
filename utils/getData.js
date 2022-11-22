const {Sequelize,DataTypes} = require("sequelize")
const {gt,gte,lte,eq,and} = Sequelize.Op
const models = require('../database/wenzhou/models')
const moment = require("moment")
const { cloneDeep, clone } = require("lodash")

/**
 * 根据表名查询最新数据
 * @param {*} table 查询的表名称
 */
let getCurrentData = async ()=>{
    
    // 查询MEA03数据
    let maxID1 = await models.MEA03.max("ID")
    let line1 = await models.MEA03.findOne({
        where:{
            "ID":{
                [eq]:maxID1
            }
        }
    })

    // 查询MKA09数据
    let maxID2 = await models.MKA09.max("ID")
    let line2 = await models.MKA09.findOne({
        where:{
            "ID":{
                [eq]:maxID2
            }
        }
    })

    // 判断日期是否匹配

    let lineData = {
        RTime:line1.dataValues.RTime,
        MEA03:line1.dataValues.D2B,
        MKA09:line2.dataValues.D2B
    }

    let res = dataFormatter(lineData)
    return res
}

/**
 * 潮位数据填充,01300 前两位是潮站编号，后三位为潮高，单位厘米，如果出现负值潮位，加上1000，例如-125厘米潮位，则发送875
 * @param {*} td 
 * @param {*} stationID 站号，默认为01
 * @returns 
 */
const tdFormatter = (tidelevel,stationID = '01')=>{
    let td = cloneDeep(tidelevel)
    td = td * 100
    td = td >= 1000 ? 999 : (td < -999 ? -999 : td)
    // console.log(td)
    td = td < 0 ? td + 1000: td
    td = Math.floor(td).toFixed(0)
    // 补零
    td = ('000'+ td).slice(-3)
    return `${stationID}${td}`
}

// 01300 含义为：前两位是潮站编号，后三位为潮高，单位厘米，如果出现负值潮位，加上1000，例如-125厘米潮位，则发送875

/**
 * 将数据库查询对象拼接为查询字符串
 * @param {*} obj 
 * @returns string 形如 WZCW,2022-11-21,09:30:00,01300,02305,03315,04325,END
 */
let dataFormatter = (obj)=>{
    let {RTime,MEA03,MKA09} = obj
    let time = moment(RTime).subtract(8,'h').format("YYYY-MM-DD,HH:mm:ss")
    let td1 = tdFormatter(MEA03,'01')
    let td2 = tdFormatter(MKA09,'02')
    return `WZCW,${time},${td1},${td2},END`
}

module.exports = {
    getCurrentData,
    tdFormatter
}