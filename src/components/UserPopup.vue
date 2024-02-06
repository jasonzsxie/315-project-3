<script>
/**
 * Represents a Vue component for managing user list.
 * @exports UserListComponent
 * @type {object}
 */
export default {
    props: {
      /**
     * The list of users passed as a prop.
     * @type {Array.<object>}
     */
        userList: []
    },
    computed: {
        employees() {
            // just need a list that is local and not a prop
            return this.userList
        }
    }
}
</script>

<template>
    <!-- <div>
        <ul v-if="true">
        <li v-for="item in this.extrasList" :key="item.item_id">
            {{ item.product_name }}
        </li>
        </ul>
        <p v-else>Loading inventory...</p>
        <p v-if="error">Error: {{ error }}</p>
    </div> -->
    <div>
    <ul v-if="employees.length > 0">
      <li v-for="item in employees" :key="item.item_id">
        <strong>{{ item.product_name }}</strong>
        <ul>
            <li>Name: {{ item.employee_name }} - Role: {{ item.employee_role }}</li>
            <!-- could also add item.employee_id and item.sales_made if we want to show more detail-->
            <!-- <li>Price: ${{ item.price }} - Reorder Price: ${{ item.reorder_price }} </li> -->
          <!-- Add more attributes as needed -->
        </ul>
      </li>
    </ul>
    <p v-else>Loading users...</p>
    <p v-if="error">Error: {{ error }}</p>
  </div>
</template>