var ecom = {};
var $editButton = $('#edit');
var $modal = $('#editModal');
ecom.subTotal = 0;
ecom.checkout = 0;
ecom.discount = 0;
ecom.totalQuantity = 0;
ecom.t;
ecom.price;
ecom.promo = 0;
ecom.database = firebase.database().ref('productsInCart');
(function (ecom) {
    ecom.ecomlist = function () {
        ecom.database.on('value', function (snapshot) {
            ecom.datalen = Object.keys(snapshot.val());
            
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
                $itemList.find('.prices').html(snapshot.val()[i].p_price * snapshot.val()[i].p_quantity);
                ecom.price = snapshot.val()[i].p_price * snapshot.val()[i].p_quantity;
                ecom.subTotal = ecom.subTotal + ecom.price;
                ecom.totalQuantity = ecom.totalQuantity + parseInt(snapshot.val()[i].p_quantity);
                $itemList.find('#edit').on('click', function (e) {
                    e.preventDefault();
                    $('.modal-image').attr('src', snapshot.val()[i].p_image);
                    $('.modal-qual').html(snapshot.val()[i].p_name);
                    $('.modal-price').html(snapshot.val()[i].p_price * snapshot.val()[i].p_quantity);
                    $('.sizedrp option').each(function () {
                        if ($(this).val() == snapshot.val()[i].p_selected_size.code)
                            $(this).attr('selected', true);
                    });
                    $('.qtyDrp option').each(function () {
                        if ($(this).val() == snapshot.val()[i].p_quantity)
                            $(this).attr('selected', true);
                    });
                    snapshot.val()[i].p_available_options.colors.forEach(function (color) {
                        var $label = $('<label>').prop('for', color.name);
                        var $input = $('<input type = "radio">').prop('id', color.name).prop('name', 'colors').prop('value', color.name).addClass('radio-buttons');
                        $input.css('background-color', color.hexcode);
                        if (color.name == snapshot.val()[i].p_selected_color.name) {
                            $input.prop('checked', true);
                        }
                        $label.appendTo($('#editModal').find('.color-box'));
                        $input.appendTo($('#editModal').find('.color-box'));
                    });
                    $modal.modal('show');
                    ecom.t = i;
                })

                $('.edit-modal-btn').on('click', function (e) {
                    if (ecom.t === i) {
                        firebase.database().ref('productsInCart/' + i).update({
                            p_quantity: $('.qtyDrp option:selected').val(),
                        });
                        if ($('.sizedrp option:selected').val() === 'Size') {
                            alert('Please enter a valid size')
                            return false;
                        }
                        firebase.database().ref('productsInCart/' + i + '/p_selected_color/').update({
                            name: $('input[type=radio]:checked').val(),
                        });
                        firebase.database().ref('productsInCart/' + i + '/p_selected_size/').update({
                            code: $('.sizedrp option:selected').val(),
                        });
                        //$('#editModal').find('.color-box').html('');
                    }
                })

            }
            $('.no-of-items').html(ecom.totalQuantity + ' ' + "ITEMS");
            $('#sub-total').html('$' + ' ' + ecom.subTotal);
            ecom.discountLogic();
        })
    }
    ecom.ecomlist();

    ecom.discountLogic = function () {
        console.log(ecom.totalQuantity)
        if (ecom.totalQuantity > 7) {
            ecom.checkout = ecom.subTotal * 0.75;
            $('.promo-applied').html('JF25 APPLIED')
            $('.promo-value').html('-$' + ' ' + (ecom.subTotal * 0.25))
        } else if (ecom.totalQuantity > 3 && ecom.totalQuantity <= 6) {
            ecom.checkout = ecom.subTotal * 0.9;
            $('.promo-applied').html('JF10 APPLIED')
            $('.promo-value').html('-$' + ' ' + (ecom.subTotal * 0.1))
        } else if (ecom.totalQuantity === 3) {
            ecom.checkout = ecom.subTotal * 0.95;
            $('.promo-applied').html('JF05 APPLIED')
            $('.promo-value').html('-$' + ' ' + (ecom.subTotal * 0.05))
        } else {
            ecom.checkout = ecom.subTotal * 1;
        }
        $('.est-total').html('$' + ' ' + ecom.checkout);
    }
})(ecom);