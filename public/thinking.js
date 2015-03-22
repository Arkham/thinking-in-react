var FilterableProductTable = React.createClass({
  getInitialState: function() {
    return {
      products: [],
      filterText: '',
      inStockOnly: false
    };
  },

  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({products: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleUserInput: function(filterText, inStockOnly) {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  },

  render: function() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput}
        />
        <ProductTable
          products={this.state.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value,
      this.refs.inStockOnlyInput.getDOMNode().checked
    );
  },
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            ref="inStockOnlyInput"
            onChange={this.handleChange}
          />
          <small> Only show products in stock</small>
        </p>
      </form>
    );
  }
});

var ProductTable = React.createClass({
  render: function() {
    var rows = [];

    var products = _.filter(this.props.products, function(product) {
      return product.name.indexOf(this.props.filterText) !== -1 &&
        (!this.props.inStockOnly || product.stocked);
    }.bind(this));

    var productsByCategory = _.groupBy(products, function(product) {
      return product.category;
    });

    for (var category in productsByCategory) {
      rows.push(<ProductCategoryRow category={category} key={category} />);
      productsByCategory[category].forEach(function(product) {
        rows.push(<ProductRow product={product} key={product.name} />);
      });
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

var ProductCategoryRow = React.createClass({
  render: function() {
    return (
      <tr>
        <th colSpan="2">{this.props.category}</th>
      </tr>
    );
  }
});

var ProductRow = React.createClass({
  render: function() {
    var name = this.props.product.stocked ?
      this.props.product.name :
      <span style={{color: 'red'}}>{this.props.product.name}</span>;

    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    );
  }
});

React.render(<FilterableProductTable url="products.json" />, document.body);
