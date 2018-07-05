var PRICE = 9.99;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    newSearch: '',
    lastSearch: ''
  },
  methods: {
    onSubmit: function()  {
      this.$http
        .get('/search/'.concat(this.newSearch))
        .then(function(res) {
          this.items = res.data;
          this.lastSearch = this.newSearch
        })
      ;

    },
    addItem: function(index) {
      this.total += PRICE;
      var item = this.items[index];
      // var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].qty++;
          // found = true;
          // break;
          return;
        }
      }
      // if (!found) {
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      // }
    },
    inc: function(item) { // getting a ref to item
      item.qty++;
      this.total += PRICE;
    },
    dec: function(item) {
      item.qty--
      this.total -= PRICE;
      if (item.qty <= 0) {
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart.splice(i, 1);
            // break;
            return;
          }
        }
      }
    }
  },
  filters: {
    currency: function(price) {
      return '$'.concat(price.toFixed(2));
    }
  }
});
