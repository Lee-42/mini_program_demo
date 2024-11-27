
import request from '../request'

// 700101开销户登记簿查询
export const exdAcctQueryApi = params => {
    return request.post('8901', params)
}

