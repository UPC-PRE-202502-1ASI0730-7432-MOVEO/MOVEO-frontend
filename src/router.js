import {createRouter, createWebHistory} from "vue-router";
import AdventureList from "./app/adventure/components/views/adventure-list.vue";
import AdventureForm from "./app/adventure/components/views/adventure-form.vue";

const routes = [
    {
        path: "/adventures",
        name: "adventures",
        component: AdventureList,
        meta: { title: "Adventure List" },
    },
    {
        path: "/adventures/new",
        name: "adventure-new",
        component: AdventureForm,
        meta: { title: "New Adventure" },
    },
    {
        path: "/adventures/edit/:id",
        name: "adventure-edit",
        component: AdventureForm,
        props: true,
        meta: { title: "Edit Adventure" },
    },
];

const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: routes,
    }
);

export default router;
