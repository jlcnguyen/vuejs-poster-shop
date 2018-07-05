var PRICE = 9.99;
var LOAD_NUM = 10

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  methods: {
    appendItems: function() {
      if (this.items.length < this.results.length) {
        console.log("in here");
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM); // get next LOAD_NUM items
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function()  {
      if (this.newSearch) {
        this.items = [];
        this.loading = true;
        this.$http
          .get('/search/'.concat(this.newSearch))
          .then(function(res) {
            this.lastSearch = this.newSearch;
            this.results = res.data;
            this.appendItems();
            this.loading = false;
          })
        ;
      }
    },
    addItem: function(index) {
      this.total += PRICE;
      var item = this.items[index];
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          this.cart[i].qty++;
          return;
        }
      }
      this.cart.push({
        id: item.id,
        title: item.title,
        qty: 1,
        price: PRICE
      });
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
  },
  computed: {
    noMoreItems: function() {
      return this.items.length === this.results.length && !this.loading;
    }
  },
  mounted: function() {
    this.onSubmit();
    // Adding scroll scrollMonitor

    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem); // pass in DOM node reference
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  }
});
