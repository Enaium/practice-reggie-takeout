package cn.enaium.reggie.service.impl;

import cn.enaium.reggie.entity.Employee;
import cn.enaium.reggie.mapper.EmployeeMapper;
import cn.enaium.reggie.service.EmployeeService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl extends ServiceImpl<EmployeeMapper, Employee> implements EmployeeService {
}
