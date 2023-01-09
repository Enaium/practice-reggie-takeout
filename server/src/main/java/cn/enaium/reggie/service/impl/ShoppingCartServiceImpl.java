package cn.enaium.reggie.service.impl;

import cn.enaium.reggie.entity.ShoppingCart;
import cn.enaium.reggie.mapper.ShoppingCartMapper;
import cn.enaium.reggie.service.ShoppingCartService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class ShoppingCartServiceImpl extends ServiceImpl<ShoppingCartMapper, ShoppingCart> implements ShoppingCartService {

}
