class ProductFilter {
  //query for allProducts queryStr for keyword

  //filter operations
  //http://localhost:5000/products?keyword="foo"
  // query for all products queryStr for query parameters

  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // create a search method
  search() {
    // keywords can include limit, keyword, page
    // if there is a keyword filter according to name  due to keyword
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const deleteArea = ["keyword", "limit", "page"];

    deleteArea.forEach((item) => delete queryCopy[item]);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resultPerPage) {
    // 1. İstekten gelen sayfa numarasını alın veya varsayılan olarak 1 kullanın
    const activePage = this.queryStr.page || 1;

    // 2. İstekten gelen limit değerini alın veya bir varsayılan (resultPerPage) kullanın
    const limit = parseInt(this.queryStr.limit) * 1 || resultPerPage;

    // 3. Hesaplanan 'skip' değerini bulun
    const skip = limit * (parseInt(activePage) - 1);

    // 4. Sorguyu oluştururken 'limit' ve 'skip' ayarlarını kullanın
    this.query = this.query.limit(limit).skip(skip);

    // 5. Bu işlem, sayfalama (sayfa numarası ve sonuç sayısı sınırlama) için kullanılır
    return this;
  }
}

export default ProductFilter;
