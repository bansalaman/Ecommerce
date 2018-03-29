var ecom = {};
var $editButton = $('#edit');
var $modal = $('#editModal');
ecom.subTotal = 0;
ecom.checkout = 0;
ecom.discount = 0;
ecom.t;
ecom.database = firebase.database().ref('productsInCart');
(function (ecom) {
    ecom.ecomlist = function (snapshot) {
        ecom.database.on('value', function (snapshot) {
            ecom.datalen = Object.keys(snapshot.val());
            //console.log(datalen.length);
            $('.no-of-items').html(ecom.datalen.length + ' ' + "ITEMS");
            for (let i = 0; i < ecom.datalen.length; i++) {
                let $itemList = $('#item').clone();
                $('.background-line').before($itemList);
                $itemList.removeClass('hide');
                $itemList.children().eq(0).children().eq(0).attr('src', snapshot.val()[i].p_image);
                $itemList.find('.type').html(snapshot.val()[i].p_variation);
                $itemList.find('.qual').html(snapshot.val()[i].p_name);
                $itemList.find('.color').html(snapshot.val()[i].p_selected_color.name);
                $itemList.find('.styles').html(snapshot.val()[i].p_style);
                $itemList.find('.sizes').html(snapshot.val()[i].p_selected_size.code);
                $itemList.find('.quan').html(snapshot.val()[i].p_quantity);
                $itemList.find('.prices').html(snapshot.val()[i].p_price);
                ecom.subTotal = ecom.subTotal + snapshot.val()[i].p_price;                
                $itemList.find('#edit').on('click', function (e) {
                    e.preventDefault();
                    $('.modal-image').attr('src', snapshot.val()[i].p_image);
                    $('.modal-qual').html(snapshot.val()[i].p_name);
                    $('.modal-price').html(snapshot.val()[i].p_price);
                    $modal.modal('show');
                    ecom.t = i;
                })

                $('.sizedrp')
                
                $('.edit-modal-btn').on('click',function(e){
                    if(ecom.t === i){
                        console.log(i);
                        firebase.database().ref('productsInCart/' + i).update({
                            p_quantity:  $('.qtyDrp option:selected').val(),
                        });
                        firebase.database().ref('productsInCart/' + i + '/p_selected_size/').update({
                            code:  $('.sizedrp option:selected').val(),
                        });
                    }
                })
                               
            }
            $('#sub-total').html('$' +' ' + ecom.subTotal);
            ecom.discountLogic();
        })
    }
    ecom.ecomlist();

    ecom.discountLogic = function() {
        if(ecom.datalen.length>10){
            ecom.checkout = ecom.subTotal * 0.75;
            //consoleconsole.log(ecom.checkout);
        }
        else if(ecom.datalen.length>3 && ecom.datalen.length<=6){
            ecom.checkout = ecom.subTotal * 0.9;
            //console.log(ecom.checkout);
        }
        else if(ecom.datalen.length === 3){
            ecom.checkout = ecom.subTotal * 0.95;
        }
        else{
            ecom.checkout = ecom.subTotal * 1;
        }
        $('.est-total').html('$' + ' ' + ecom.checkout);
    }
})(ecom);