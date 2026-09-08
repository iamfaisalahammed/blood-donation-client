import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const GiveFund = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    axios
      .post("http://localhost:5173.app/fund", data)
      .then((res) => {
        navigate("/fundpay");
      });
  };
  return (
    <div className="lg:w-3/4 mx-auto">
      <div className="text-center p-10">
        <img
          className="size-36"
          src="https://i.ibb.co.com/jM8b6H1/images-10.jpg"
          alt=""
        />
      </div>
      <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Donor Name</span>
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              name="name"
              placeholder="Name"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Fund Amount</span>
            </label>
            <input
              {...register("amount", { required: true })}
              type="number"
              name="amount"
              placeholder="Fund Amount"
              className="input input-bordered"
              required
            />
          </div>
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Funding Date </span>
            </label>
            <input
              {...register("date", { required: true })}
              type="date"
              name="date"
              placeholder="Date"
              className="input input-bordered"
              required
            />
          </div>
          <div className="my-5 text-center ">
            <button
              type="submit"
              className="btn text-2xl text-white bg-red-800 hover:bg-black "
            >
              Give Fund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GiveFund;
