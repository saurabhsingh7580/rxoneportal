import FormControl from "../form/FormControl";

function AccountDetails(props) {
  const { areDocsSubmitted } = props;

  return (
    <>
      <FormControl
        info="Enter account owner name"
        label="Beneficiary Name"
        type="text"
        name="account.beneficiaryName"
        disabled={areDocsSubmitted}
      />

      <FormControl
        info="Enter account owner branch IFSC Code"
        label="Branch IFSC Code"
        type="text"
        name="account.branchIfscCode"
        disabled={areDocsSubmitted}
      />

      <FormControl
        info="Enter valid bank account number"
        label="Account Number"
        type="password"
        name="account.accountNumber"
        disabled={areDocsSubmitted}
      />

      <FormControl
        info="Re-enter valid bank account number for confirmation"
        label="Re-Enter Account Number"
        type="text"
        name="account.reEnterAccNumber"
        disabled={areDocsSubmitted}
      />
    </>
  );
}

export default AccountDetails;
