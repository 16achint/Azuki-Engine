import React from "react";

function Icon() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top-left corner */}
      <img
        className="absolute -inset-10 left-30 w-22"
        src="https://media-public.canva.com/HV3f8/MAE7qMHV3f8/1/t.png"
        alt="spring"
      />
      <img
        className="absolute top-1/5 w-30"
        src="https://media-public.canva.com/ZTCCQ/MAE7qIZTCCQ/1/t.png"
        alt="ring"
      />
      <img
        className="absolute top-1/2 w-25"
        src="https://media-public.canva.com/JqgQE/MAE7qIJqgQE/1/t.png"
        alt="piramate"
      />
      <img
        className="absolute -bottom-12 w-50"
        src="https://media-public.canva.com/LhtIc/MAE7AmLhtIc/1/s.png"
        alt="ring2"
      />

      {/* Top-right corner */}
      <img
        className="absolute -top-5 right-20 w-40"
        src="https://media-public.canva.com/oLZJI/MAE8TyoLZJI/1/s.png"
        alt="diamond"
      />
      <img
        className="absolute top-1/4 right-1 w-30"
        src="https://media-public.canva.com/c_nbU/MAE7qKc_nbU/1/t.png"
        alt="cristle"
      />
      <img
        className="absolute top-1/2 right-5 w-25"
        src="https://media-public.canva.com/LAaCM/MAE7qBLAaCM/1/t.png"
        alt="ring3"
      />
      <img
        className="absolute -bottom-12 right-12 w w-50"
        src="https://media-public.canva.com/qPV74/MAE7AvqPV74/1/s.png"
        alt="cube"
      />
    </div>
  );
}

export default Icon;
