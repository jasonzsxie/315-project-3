import ManagerOrderLog from '../components/ManagerOrderLog.vue'
import ManagerSalesRevenue from '../components/ManagerSalesRevenue.vue'
import ManagerInventoryManagement from '../components/ManagerInventoryManagement.vue'
import ManagerMenuManagement from '../components/ManagerMenuManagement.vue'
import ManagerProductUsage from '../components/ManagerProductUsage.vue'
import HomeView from '../views/HomeView.vue'
import CashierView from '../views/CashierView.vue'
import ManagerView from '../views/ManagerView.vue'
import MenuView from '../views/MenuView.vue'

import CustomerView from '../views/CustomerView.vue'
import AdminView from '../views/AdminView.vue'
import AboutView from '../views/AboutView.vue'

import HolderChoices from '../components/HolderChoices.vue'
import FlavorChoices from '../components/FlavorChoices.vue'
import ToppingChoices from '../components/ToppingChoices.vue'
import ExtraChoices from '../components/ExtraChoices.vue'

import EmployeeView from '../views/EmployeeView.vue'
import AddItem from '../components/AddItem.vue'
import ReplaceTopItem from '../components/ReplaceTopItem.vue'

import AddUser from '../components/AddUser.vue'
import DeleteUser from '../components/DeleteUser.vue'
import UpdateUser from '../components/UpdateUser.vue'

import DeleteItem from '../components/DeleteItem.vue'

import RestockReport from '../components/RestockReport.vue'
import SalesTrend from '../components/SalesTrend.vue'
import SalesReport from '../components/SalesReport.vue'
import ExcessReport from '../components/ExcessReport.vue'

import LoginView from '../views/LoginView.vue'

import UpdateInventory from '../components/UpdateInventory.vue'

import { createRouter, createWebHashHistory } from 'vue-router'






const routes = [
  {
    path: '/',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/about',
    name: 'AboutView',
    component: AboutView
  },
  {
    path: '/employee',
    name: 'EmployeeView',
    component: EmployeeView
  },
  {
    path: '/cashier',
    name: 'CashierView',
    component: CashierView
  },
  {
    path: '/manager',
    name: 'ManagerView',
    component: ManagerView
  },
  {
    path: '/customer',
    name: 'CustomerView',
    component: CustomerView
  },
  {
    path: '/menu',
    name: 'MenuView',
    component: MenuView
  },
  {
    path: '/admin',
    name: 'AdminView',
    component: AdminView

  },
  {
    path: '/orderlog',
    name: 'OrderLog',
    component: ManagerOrderLog
  },
  {
    path: '/salesrevenue',
    name: 'SalesRevenue',
    component: ManagerSalesRevenue
  },
  {
    path: '/inventorymanagement',
    name: 'InventoryManagement',
    component: ManagerInventoryManagement
  },
  {
    path: '/menumanagement',
    name: 'MenuManagement',
    component: ManagerMenuManagement
  },
  {
    path: '/productusage',
    name: 'ProductUsage',
    component: ManagerProductUsage
  },
  {
    path: '/customer/holders',
    name: 'HolderChoices',
    component: HolderChoices
  },
  {
    path: '/customer/flavors',
    name: 'FlavorChoices',
    component: FlavorChoices
  },
  {
    path: '/customer/toppings',
    name: 'ToppingChoices',
    component: ToppingChoices
  },
  {
    path: '/customer/extras',
    name: 'ExtraChoices',
    component: ExtraChoices
  },
  {
    path: '/additem',
    name: 'AddItem',
    component: AddItem
  },
  {
    path: '/deleteitem',
    name: 'DeleteItem',
    component: DeleteItem
  },
  {
    path: '/replacetopitem',
    name: 'ReplaceTopItem',
    component: ReplaceTopItem
  },
  {
    path: '/updateinventory',
    name: 'UpdateInventory',
    component: UpdateInventory
  },
  {
    path: '/admin/adduser',
    name: 'AddUser',
    component: AddUser
  },
  {
    path: '/admin/deleteuser',
    name: 'DeleteUser',
    component: DeleteUser
  },
  {
    path: '/admin/updateuser',
    name: 'UpdateUser',
    component: UpdateUser
  },
  { 
    path: '/restockReport',
    name: 'RestockReport',
    component: RestockReport
  },
  {
    path: '/salesTrend',
    name: 'SalesTrend',
    component: SalesTrend
  },
  {
    path: '/salesReport',
    name: 'SalesReport',
    component: SalesReport
  },
  {
    path: '/excessReport',
    name: 'ExcessReport',
    component: ExcessReport
  }
]

const router = createRouter({
  mode: 'history',
  history: createWebHashHistory(),
  scrollBehavior() {
    return {top:0}
  },
  routes
})



export default router
