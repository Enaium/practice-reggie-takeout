package cn.enaium.reggie.service.impl;

import cn.enaium.reggie.entity.AddressBook;
import cn.enaium.reggie.mapper.AddressBookMapper;
import cn.enaium.reggie.service.AddressBookService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class AddressBookServiceImpl extends ServiceImpl<AddressBookMapper, AddressBook> implements AddressBookService {

}
