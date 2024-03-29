
$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
});

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/cart"
  }).done((cart) => {
    for(item of cart) {
      $("<div>").text(item.name).appendTo($("body"));
    }
  });;
});


// BUTTONS ON CLICK EVENT
$(document).ready(function() {

  $("#login_form").on("submit", function(event) {
    event.preventDefault();
    $(() => {
      $.ajax({
        method: "POST",
        url: "/sessions",
        data: $(this).serialize()
      }).done((user) => {
        var url = window.location.pathname;
        // console.log(url);
        // var getQuery = url.split('?')[1]
        // console.log(getQuery);
        // window.location = "/";
        // $('#login_div').hide();
        // $('#Welcome_user').show();
        console.log("post request complete");
        location.reload();
      });;
    });
  })

  // ADD TO CART
  //     // add to local storage, push item to array
  //     // another function populates cart (render.items)
  //     // Gets through jquery, and iterates using for loop


  $(document).on("click",".addItem",function() {


    // let row = $("#item1");
    let row = $(this).closest("tr");
    let storageArray = [];
    let cartArray = JSON.parse(localStorage.getItem("cartArray")) ?? [];



  if (typeof(Storage) !== "undefined") {
    // Store in storageArray
    localStorage.item_name = $(".itemName", row).text();
    localStorage.item_price = $(".itemPrice", row).text();
    storageArray.push(localStorage.item_name);
    storageArray.push(localStorage.item_price);
    localStorage.setItem("storageArray", JSON.stringify(storageArray));

    // Retrieve and print in cart
    // CREATES table row
    const parent = document.getElementById("cartItemsContainer");
    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    const tdPrice = document.createElement("td");
    // const removeButtonTd = document.createElement("td");
    // const removeButton = document.createElement("button");

    tr.setAttribute("class", "cartTr");
    tdName.setAttribute("class", "resultName");
    tdPrice.setAttribute("class", "resultPrice");
    // removeButton.setAttribute("class", "removeButton");
    // removeButton.setAttribute("type", "submit");

    // ADDS td to row
    tdName.innerHTML = storageArray[0];
    tdPrice.innerHTML = storageArray[1];
    // removeButton.innerHTML = "REMOVE"


    // ADDS button to td, all td's to tr, and tr to parent (cartItemsContainer)
    // removeButtonTd.prepend(removeButton);
    // tr.prepend(removeButtonTd);
    tdPrice.prepend("$");
    tr.prepend(tdPrice);
    tr.prepend(tdName);
    parent.prepend(tr);




  } else {
    document.getElementById("result2").innerHTML = "Sorry, your browser does not support Web Storage...";
  }

  // Building and adding the cartArray to storage
  cartArray.push(storageArray);
  localStorage.setItem("cartArray", JSON.stringify(cartArray));



  // GETTING TOTAL PURCHASE PRICE
  let itemsTotal = 0;

  console.log("typeof(cartArray) = ", typeof cartArray);
  for (let i = 0; i < cartArray.length; i++) {
          // itemsTotal += item[i];
          console.log("typeof cartArray[i][1] = ", cartArray[i][1], typeof cartArray[i][1]);
          itemsTotal += parseFloat(cartArray[i][1]);
          console.log("itemsTotal = ", itemsTotal);
  }

  // DEFINING html elements for TOTAL_PRICE
  const totalsRow = document.createElement("tr");
  const total = document.createElement("td");
  const sumItems = document.createElement("td");
  const totalsParent = document.getElementById("cartButtons");

  totalsRow.setAttribute("class", "totalsRow");

  sumItems.innerHTML = itemsTotal;
  total.innerHTML = "TOTAL";

  // ADDING TOTAL_PRICE TO CART
  if (totalsParent) {
    $(".totalsRow").remove();
    // $("#cartItemsContainer").remove(totalsRow);
    totalsRow.prepend(sumItems);
    sumItems.prepend("$");
    totalsRow.prepend(total);
    totalsParent.prepend(totalsRow);
  } else {
    totalsRow.prepend(sumItems);
    sumItems.prepend("$");
    totalsRow.prepend(total);
    totalsParent.prepend(totalsRow);
  }

});

 // REMOVE FROM CART
//  $('.clearCartButton').click(function(){
  // remove from cart
  // $('.cartTr').remove();
  // $('.totalsRow').remove();

  // remove from localstorage(cart array)
  // localStorage.removeItem("cartArray");

// PURCHASE BUTTON TO PROMP MODAL
$('.purchaseButton').click(function(){
  let cartArrayModal = JSON.parse(localStorage.getItem("cartArray")) ?? [];

  modalItemsTotal = parseInt(cartArrayModal[0][1]);

  $('#myModal').modal('show');

   const cart = JSON.parse(localStorage.getItem("cartArray"))
   console.log(cart)

   let firstItem = true;

   for (const items in cartArrayModal){
     if(firstItem){
      $('#modalInfo').append(`
      <tr>
      <td>Leighton Chen</td>
      <td>7788956372</td>
      <td><p id="modalItem">${cartArrayModal[items][0]}</p></td>
      <td><p id="modalPrice">${cartArrayModal[items][1]}</p></td>
      </tr>
      `)
     } else  {
      $('#modalInfo').append(`
      <tr>
      <td style="opacity:0">Leighton Chen</td>
      <td style="opacity:0">7788956372</td>
      <td class="moreSpace"><p id="modalItem2">${cartArrayModal[items][0]}</p></td>
      <td class="moreSpace"><p id="modalPrice2">${cartArrayModal[items][1]}</p></td>
      </tr>
      `)
     }
    firstItem = false;
   }
  });

  $('#cancel_order').click(function(){
    $('#modalInfo').empty();
  });

  // REMOVE FROM CART
$('.clearCartButton').click(function(){
  // remove from cart
  $('.cartTr').remove();
  $('.totalsRow').remove();

  // remove from localstorage(cart array)
  localStorage.removeItem("cartArray");


  // CONFIRM ORDER PURCHASE IN MODAL ROUTE TO TWILIO
  $(document).on("click","#twilio_next",function() {
    alert("Thank you for your order! 🕺");

  // TWILIO FUNCTION/PATH DISABLED FOR NOW, WILL ENABLE DURING DEMO//
    $.ajax({
      method: "POST",
      url: "/api/twilio",
      data: { cart: JSON.parse(localStorage.getItem("cartArray")) }
    }).done(() => {
      console.log('message sent ')
    });;

    // AJAX post sends all items data in local storage to server side


    });
  });
});
