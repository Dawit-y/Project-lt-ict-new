// import PropTypes from "prop-types";
// import React from "react";

// const FeatureBox = (props) => {
//   return (
//     <React.Fragment>
//       <div className="mt-4 mt-md-auto">
//         <div className="d-flex align-items-center mb-2">
//           <div className="features-number font-weight-semibold display-4 me-3">
//             {props.num}
//           </div>
//           <h4 className="mb-0">{props.title}</h4>
//         </div>
//         <p className="text-muted">{props.desc}</p>
//         <div className="text-muted mt-4">
//           {props.features.map((feature, key) => (
//             <p key={key} className={feature.id === 1 ? "mb-2" : ""}>
//               <i className="mdi mdi-circle-medium text-success me-1" />
//               {feature.desc}
//             </p>
//           ))}
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// FeatureBox.propTypes = {
//   desc: PropTypes.any,
//   features: PropTypes.array,
//   num: PropTypes.string,
//   title: PropTypes.string,
// };

// export default FeatureBox;

import PropTypes from "prop-types";
import React from "react";

const FeatureBox = ({ num, title, desc, features }) => {
  return (
    <div className="mt-4 mt-md-auto">
      <div className="d-flex align-items-center mb-3">
        <div className="features-number fw-bold display-4 text-primary me-3">
          {num}
        </div>
        <h4 className="mb-0">{title}</h4>
      </div>

      <p className="text-muted">{desc}</p>

      <div className="text-muted mt-3">
        {features.map((feature, key) => (
          <div key={key} className="d-flex align-items-start mb-2">
            <i className="mdi mdi-check-circle-outline text-primary me-2 h5 mb-0" />
            <span>{feature.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

FeatureBox.propTypes = {
  desc: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      desc: PropTypes.string,
    })
  ).isRequired,
  num: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default FeatureBox;
