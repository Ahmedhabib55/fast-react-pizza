// import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import Button from '../../ui/Button';
import store from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import { formatCurrency } from '../../utils/helpers';
import { useState } from 'react';
import { fetchingAddress } from '../user/userSlice';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const {
    userName,
    position,
    address,
    status: addressStatus,
    errorMsg,
  } = useSelector((state) => state.user);
  const isLoadingAddress = addressStatus === 'loading';

  const formError = useActionData();
  const dispatch = useDispatch();
  const cart = useSelector(getCart);

  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalCartPriceWithPriority = totalCartPrice + priorityPrice;

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className=" mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>
      {/* <button onClick={() => dispatch(fetchingAddress())}>get position</button> */}
      <Form method="POST">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="input grow"
            defaultValue={userName}
            type="text"
            name="customer"
            required
          />
        </div>

        <div className="mb-4 flex flex-col gap-4  sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formError?.phone && (
              <p className="mt-2 rounded-full bg-red-100 p-2 text-xs text-red-700 ">
                {formError.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-4 flex  flex-col gap-4 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="input w-full "
              type="text"
              name="address"
              required
              disabled={isLoadingAddress}
              defaultValue={address}
              // value={?userAddress || ''}
            />
            {addressStatus === 'error' && (
              <p className="mt-2 rounded-full bg-red-100 p-2 text-xs text-red-700 ">
                {errorMsg}
              </p>
            )}
          </div>
          {!position.longitude && !position.latitude && (
            <span className="absolute bottom-1 right-[3px] top-[3px]  z-50 sm:bottom-[5px] sm:right-[5px] sm:top-[5px]">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchingAddress());
                }}
                type="small"
                disabled={isLoadingAddress}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />
        <input
          type="hidden"
          name="position"
          value={
            position.latitude && position.longitude
              ? ` ${position.latitude}, ${position.longitude}`
              : ''
          }
        />
        <div>
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? 'placing order....'
              : `Order now from ${formatCurrency(totalCartPriceWithPriority)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// form form router-dom not need to submit function because it is handled by action here but we need to search and learn more about this
// and as we did in the example below we get data from the form by request object without any javascript code
// here we used request as properties to get the data from the form
// if we need to add some data to the form we need to add new input fields type hidden and give it the data and name of the field

export async function action({ request }) {
  const formatData = await request.formData();
  const data = Object.fromEntries(formatData);
  const order = {
    ...data,
    priority: data.priority === true,
    cart: JSON.parse(data.cart),
  };
  console.log(order);
  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number, we might need it to contact you';
  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
