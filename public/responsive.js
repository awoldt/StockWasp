const relatedStockCards = document.getElementsByClassName("related_stock_card");
const relatedStockCols = document.getElementsByClassName("related_stock_col");

window.onload = () => {
  //extra lg
  if (window.innerWidth >= 1200) {
    for (let i = 0; i < relatedStockCols.length; ++i) {
      relatedStockCols[i].setAttribute("class", "related_stock_col col-4");
    }
    for (let i = 0; i < relatedStockCards.length; ++i) {
      relatedStockCards[i].style.width = "100%";
    }
  }
  //lg
  else if (window.innerWidth >= 992) {
    for (let i = 0; i < relatedStockCols.length; ++i) {
      relatedStockCols[i].setAttribute("class", "related_stock_col col-6");
    }
    for (let i = 0; i < relatedStockCards.length; ++i) {
      relatedStockCards[i].style.width = "100%";
    }
  }
  //md
  else if (window.innerWidth >= 768) {
    for (let i = 0; i < relatedStockCols.length; ++i) {
      relatedStockCols[i].setAttribute("class", "related_stock_col col-6");
    }
    for (let i = 0; i < relatedStockCards.length; ++i) {
      relatedStockCards[i].style.width = "100%";
    }
  }
  //sm
  else {
    for (let i = 0; i < relatedStockCols.length; ++i) {
      relatedStockCols[i].setAttribute("class", "related_stock_col col-12");
    }
    for (let i = 0; i < relatedStockCards.length; ++i) {
      relatedStockCards[i].style.width = "100%";
    }
  }
};

window.onresize = () => {
  //extra lg
  if (window.innerWidth >= 1200) {
    for (let i = 0; i < relatedStockCols.length; ++i) {
      relatedStockCols[i].setAttribute("class", "related_stock_col col-4");
    }
    for (let i = 0; i < relatedStockCards.length; ++i) {
      relatedStockCards[i].style.width = "100%";
    }
  }
  //lg
  else if (window.innerWidth >= 992) {
    for (let i = 0; i < relatedStockCols.length; ++i) {
      relatedStockCols[i].setAttribute("class", "related_stock_col col-6");
    }
    for (let i = 0; i < relatedStockCards.length; ++i) {
      relatedStockCards[i].style.width = "100%";
    }
  }
  //md
  else if (window.innerWidth >= 768) {
    for (let i = 0; i < relatedStockCols.length; ++i) {
      relatedStockCols[i].setAttribute("class", "related_stock_col col-6");
    }
    for (let i = 0; i < relatedStockCards.length; ++i) {
      relatedStockCards[i].style.width = "100%";
    }
  }
  //sm
  else {
    for (let i = 0; i < relatedStockCols.length; ++i) {
      relatedStockCols[i].setAttribute("class", "related_stock_col col-12");
    }
    for (let i = 0; i < relatedStockCards.length; ++i) {
      relatedStockCards[i].style.width = "100%";
    }
  }
};
