package cn.enaium.reggie.service.impl;

import cn.enaium.reggie.entity.OrderDetail;
import cn.enaium.reggie.mapper.OrderDetailMapper;
import cn.enaium.reggie.service.OrderDetailService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class OrderDetailServiceImpl extends ServiceImpl<OrderDetailMapper, OrderDetail> implements OrderDetailService {

}