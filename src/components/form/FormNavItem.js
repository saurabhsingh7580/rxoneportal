function FormNavItem(props) {
  const { itemNumber, itemLabel, isActive, onNavItem } = props;

  return (
    <div
      className="form-nav-item d-flex flex-column align-items-center text-center mx-0"
      onClick={() => onNavItem(itemNumber)}
    >
      <div
        className={`form-nav-item__number text-center ${
          isActive ? "form-nav-item-active" : ""
        }`}
      >
        {itemNumber}
      </div>

      <div className={`form-nav-item__label fs-6`}>
        <small>{itemLabel}</small>
      </div>
    </div>
  );
}

export default FormNavItem;
