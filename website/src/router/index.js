/*
 * Copyright © 2023 Enaium <enaium@outlook.com>
 *
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
 */

import {createRouter, createWebHistory} from "vue-router";
import Backend from "@/layouts/backend/Backend.vue";
import MemberList from "@/pages/backend/member/List.vue"
import MemberAdd from "@/pages/backend/member/Add.vue"
import CategoryList from "@/pages/backend/category/List.vue"
import FoodList from "@/pages/backend/food/List.vue"
import FoodAdd from "@/pages/backend/food/Add.vue"
import ComboList from "@/pages/backend/combo/List.vue"
import ComboAdd from "@/pages/backend/combo/Add.vue"
import OrderList from "@/pages/backend/order/List.vue"
import BackendLogin from "@/pages/backend/Login.vue";
import Frontend from "@/layouts/frontend/Frontend.vue";
import Home from "@/pages/frontend/Home.vue";
import Login from "@/pages/frontend/Login.vue";
import AddOrder from "@/pages/frontend/AddOrder.vue";
import User from "@/pages/frontend/User.vue";
import Address from "@/pages/frontend/Address.vue";
import AddressEdit from "@/pages/frontend/AddressEdit.vue";
import Order from "@/pages/frontend/Order.vue";
import NoNetwork from "@/pages/frontend/NoNetwork.vue";
import PaySuccess from "@/pages/frontend/PaySuccess.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/frontend",
            name: "frontend",
            component: Frontend,
            children: [
                {
                    path: "",
                    name: "home",
                    component: Home
                },
                {
                    path: "login",
                    name: "login",
                    component: Login
                },
                {
                    path: "user",
                    name: "user",
                    component: User
                },
                {
                    path: "address",
                    name: "address",
                    component: Address
                },
                {
                    path: "address-edit",
                    name: "address-edit",
                    component: AddressEdit
                },
                {
                    path: "order",
                    name: "order",
                    component: Order
                },
                {
                    path: "add-order",
                    name: "add-order",
                    component: AddOrder
                },
                {
                    path: "no-network",
                    name: "no-network",
                    component: NoNetwork
                },
                {
                    path: "pay-success",
                    name: "pay-success",
                    component: PaySuccess
                },
            ]
        },
        {
            path: "/backend",
            name: "backend",
            component: Backend,
            redirect: "/backend/member/list",
            children: [
                {
                    path: "member/list",
                    name: "backend-member-list",
                    component: MemberList
                },
                {
                    path: "member/add",
                    name: "backend-member-add",
                    component: MemberAdd
                },
                {
                    path: "category/list",
                    name: "backend-category-list",
                    component: CategoryList
                },
                {
                    path: "food/list",
                    name: "backend-food-list",
                    component: FoodList
                },
                {
                    path: "food/add",
                    name: "backend-food-add",
                    component: FoodAdd
                },
                {
                    path: "combo/list",
                    name: "backend-combo-list",
                    component: ComboList
                },
                {
                    path: "combo/add",
                    name: "backend-combo-add",
                    component: ComboAdd
                },
                {
                    path: "order/list",
                    name: "backend-order-list",
                    component: OrderList
                }
            ]
        },
        {
            path: "/backend/login",
            name: "backend-login",
            component: BackendLogin,
        }
    ]
})