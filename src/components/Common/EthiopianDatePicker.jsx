import EtDatePicker, { EtLocalizationProvider } from "habesha-datepicker";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/commonMethods";

function Provider({ children }) {
  return (
    <EtLocalizationProvider localType="AO">
      {children}
    </EtLocalizationProvider>
  );
}

function EthiopianDatePicker({ isRequired, validation, componentId, minDate, maxDate }) {
  const { t } = useTranslation();

  const rawValue = validation?.values?.[componentId] || "";
  const value = rawValue ? new Date(rawValue.replace(/\//g, "-")) : null;

  const hasError = validation.touched[componentId] && validation.errors[componentId];

  return (
    <Provider>
      <EtDatePicker
        label={t(componentId)}
        onChange={(date) => {
          const formattedDate = formatDate(date);
          validation.setFieldValue(componentId, formattedDate, true); // validate on change
          validation.setFieldTouched(componentId, true, true); // ensure it's marked as touched
        }}
        value={value}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: hasError ? 'red' : 'gray',
            },
            '&:hover fieldset': {
              borderColor: hasError ? 'red' : 'gray',
            },
            '&.Mui-focused fieldset': {
              borderColor: hasError ? 'red' : 'gray',
            },
          },
          width: "100%",
          marginTop: "10px",
        }}
        margin="normal"
        size="small"
        minDate={minDate}
        maxDate={maxDate}
        required={isRequired}
        lang="AO"
      />
      {validation.touched[componentId] && validation.errors[componentId] && (
        <div className="text-danger small">
          {validation.errors[componentId]}
        </div>
      )}
    </Provider>
  );
}


export default EthiopianDatePicker