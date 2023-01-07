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
import CategoryList from "@/pages/backend/category/List.vue"

export default createRouter({
    history: createWebHistory(),
    routes: [
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
                    path: "category/list",
                    name: "backend-category-list",
                    component: CategoryList
                }
            ]
        }
    ]
})