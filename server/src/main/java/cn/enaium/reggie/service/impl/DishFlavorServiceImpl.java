package cn.enaium.reggie.service.impl;

import cn.enaium.reggie.entity.DishFlavor;
import cn.enaium.reggie.mapper.DishFlavorMapper;
import cn.enaium.reggie.service.DishFlavorService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class DishFlavorServiceImpl extends ServiceImpl<DishFlavorMapper, DishFlavor> implements DishFlavorService {
}
