package cn.enaium.reggie.service.impl;

import cn.enaium.reggie.entity.User;
import cn.enaium.reggie.mapper.UserMapper;
import cn.enaium.reggie.service.UserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
}
