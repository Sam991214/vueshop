import Vue from 'vue'
import Element, { Button } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {Form, FormItem} from 'element-ui'
import {Input} from 'element-ui'
// 导入弹框提示，需要全局挂载，和axios里的$http一样
import {Message} from 'element-ui'
import {Container,Header,Aside,Main} from 'element-ui'
import {Menu,Submenu,MenuItemGroup,MenuItem} from 'element-ui'
// 导入组件首字母大写,有—要删除
import {Breadcrumb,BreadcrumbItem} from 'element-ui'
import {Card} from 'element-ui'
import {Select,Row,Col} from 'element-ui'
import {Table,TableColumn} from 'element-ui'
import {Switch,Tooltip,Pagination,Dialog} from 'element-ui'
import { MessageBox,Tag,Tree,Option,
    Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,Upload} from 'element-ui'
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'





Vue.use(Element)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
// 导入弹框提示，需要全局挂载，和axios里的$http一样,每个组件可以通过this直接访问￥message
Vue.prototype.$message = Message


Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(Submenu)    
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
// 挂载调用$confirm方法即可打开消息提示
Vue.prototype.$comfirm=MessageBox