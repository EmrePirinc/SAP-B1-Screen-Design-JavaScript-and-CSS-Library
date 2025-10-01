/**
 * SAP Business One UI Components Library
 * Version: 1.0.0
 *
 * Bu kütüphane SAP Business One standartlarına uygun UI bileşenlerini içerir.
 * Toplam 13 adet bileşen: StaticText, EditText, LinkedButton, Button, CheckBox,
 * ComboBox, ExtendedEditText, OptionButton, TabControl, Grid, Matrix, PictureBox, ButtonCombo
 */

// =============================================================================
// 1. STATICTEXT (ETİKET/LABEL) BİLEŞENİ
// =============================================================================

function createSBOStaticText(options = {}) {
  const {
    caption = 'Label',
    linkTo = null,
    isRequired = false,
    isDisabled = false,
    width = 'auto',
    textAlign = 'right'
  } = options;

  const disabledClass = isDisabled ? 'sbo-static-text--disabled' : '';
  const requiredClass = isRequired ? 'sbo-static-text--required' : '';
  const linkAttribute = linkTo ? `data-link-to="${linkTo}"` : '';
  const clickHandler = linkTo ? 'onclick="focusLinkedControl(this)"' : '';

  return `
    <label class="sbo-static-text ${disabledClass} ${requiredClass}"
           style="width: ${width}; text-align: ${textAlign};"
           ${linkAttribute}
           ${clickHandler}>
      ${caption}${caption.endsWith(':') ? '' : ':'}
    </label>
  `;
}

function focusLinkedControl(staticTextElement) {
  const linkTo = staticTextElement.getAttribute('data-link-to');
  if (linkTo) {
    const linkedControl = document.getElementById(linkTo);
    if (linkedControl) {
      linkedControl.focus();
    }
  }
}

// =============================================================================
// 2. EDITTEXT (METİN GİRİŞ KUTUSU) BİLEŞENİ
// =============================================================================

function createSBOEditText(options = {}) {
  const {
    uniqueId = 'editText_' + Date.now(),
    value = '',
    placeholder = '',
    width = '120px',
    height = '19px',
    isDisabled = false,
    isReadOnly = false,
    isPassword = false,
    isRequired = false,
    maxLength = null,
    dataSource = null,
    chooseFromListUID = null,
    linkedObject = null,
    tabIndex = null
  } = options;

  const disabledClass = isDisabled ? 'sbo-edit-text--disabled' : '';
  const readOnlyClass = isReadOnly ? 'sbo-edit-text--readonly' : '';
  const requiredClass = isRequired ? 'sbo-edit-text--required' : '';

  const inputType = isPassword ? 'password' : 'text';
  const disabledAttr = isDisabled ? 'disabled' : '';
  const readOnlyAttr = isReadOnly ? 'readonly' : '';
  const maxLengthAttr = maxLength ? `maxlength="${maxLength}"` : '';
  const tabIndexAttr = tabIndex ? `tabindex="${tabIndex}"` : '';

  const dataAttributes = [
    dataSource ? `data-source="${dataSource}"` : '',
    chooseFromListUID ? `data-choose-from-list="${chooseFromListUID}"` : '',
    linkedObject ? `data-linked-object="${linkedObject}"` : ''
  ].filter(attr => attr).join(' ');

  return `
    <input type="${inputType}"
           id="${uniqueId}"
           class="sbo-edit-text ${disabledClass} ${readOnlyClass} ${requiredClass}"
           style="width: ${width}; height: ${height};"
           value="${value}"
           placeholder="${placeholder}"
           ${disabledAttr}
           ${readOnlyAttr}
           ${maxLengthAttr}
           ${tabIndexAttr}
           ${dataAttributes}
           onblur="handleEditTextBlur(this)"
           onfocus="handleEditTextFocus(this)"
           onchange="handleEditTextChange(this)" />
  `;
}

function handleEditTextFocus(element) {
  element.classList.add('sbo-edit-text--focused');
}

function handleEditTextBlur(element) {
  element.classList.remove('sbo-edit-text--focused');

  const chooseFromList = element.getAttribute('data-choose-from-list');
  if (chooseFromList && element.value.trim()) {
    validateChooseFromListValue(element);
  }
}

function handleEditTextChange(element) {
  const event = new CustomEvent('sboEditTextChanged', {
    detail: {
      element: element,
      value: element.value,
      uniqueId: element.id
    }
  });
  document.dispatchEvent(event);
}

function validateChooseFromListValue(element) {
  const value = element.value.trim();
  if (value) {
    console.log(`Validating ${value} for Choose From List`);
  }
}

// =============================================================================
// 3. LINKEDBUTTON (BAĞLANTI DÜĞMESİ - SARI OK) BİLEŞENİ
// =============================================================================

function createSBOLinkedButton(options = {}) {
  const {
    uniqueId = 'linkedBtn_' + Date.now(),
    linkTo = null,
    linkedObject = null,
    width = '19px',
    height = '19px',
    isDisabled = false,
    autoActivate = true
  } = options;

  const disabledClass = isDisabled ? 'sbo-linked-button--disabled' : '';
  const disabledAttr = isDisabled ? 'disabled' : '';

  // Data attributes for linking
  const linkToAttr = linkTo ? `data-link-to="${linkTo}"` : '';
  const linkedObjectAttr = linkedObject ? `data-linked-object="${linkedObject}"` : '';
  const autoActivateAttr = autoActivate ? 'data-auto-activate="true"' : '';

  return `
    <button type="button"
            id="${uniqueId}"
            class="sbo-linked-button ${disabledClass}"
            style="width: ${width}; height: ${height};"
            ${disabledAttr}
            ${linkToAttr}
            ${linkedObjectAttr}
            ${autoActivateAttr}
            onclick="handleLinkedButtonClick(this)"
            title="İlgili forma git">
      <span class="sbo-linked-button__arrow"></span>
    </button>
  `;
}

// LinkedButton event handler
function handleLinkedButtonClick(button) {
  if (button.disabled) return;

  const linkTo = button.getAttribute('data-link-to');
  const linkedObject = button.getAttribute('data-linked-object');

  if (!linkTo) {
    console.warn('LinkedButton: linkTo attribute is required');
    return;
  }

  // Find the linked EditText
  const linkedInput = document.getElementById(linkTo);
  if (!linkedInput) {
    console.warn(`LinkedButton: Cannot find linked input with ID: ${linkTo}`);
    return;
  }

  const inputValue = linkedInput.value.trim();

  if (inputValue) {
    // Input has value - open the form for this specific record
    openLinkedObjectForm(inputValue, linkedObject);
  } else {
    // Input is empty - open Choose From List
    openChooseFromList(linkedInput, linkedObject);
  }

  // Dispatch custom event
  const event = new CustomEvent('sboLinkedButtonClicked', {
    detail: {
      button: button,
      linkedInput: linkedInput,
      inputValue: inputValue,
      linkedObject: linkedObject,
      action: inputValue ? 'openForm' : 'chooseFromList'
    }
  });
  document.dispatchEvent(event);
}

// Helper functions for SAP B1 integration
function openLinkedObjectForm(value, objectType) {
  console.log(`Opening form for object type: ${objectType}, value: ${value}`);

  // SAP B1 object type mappings
  const objectTypeNames = {
    '2': 'Business Partner',
    '4': 'Item Master Data',
    '17': 'Sales Order',
    '13': 'Sales Invoice',
    '14': 'Sales Delivery',
    '15': 'Sales Return',
    '18': 'Purchase Order',
    '19': 'Purchase Invoice',
    '20': 'Purchase Delivery',
    '21': 'Purchase Return'
  };

  const objectName = objectTypeNames[objectType] || `Object Type ${objectType}`;
  console.log(`Opening ${objectName} form for: ${value}`);

  // Real implementation would call SAP B1 form opening
  // Application.Forms.Item(FormID).Select()
}

function openChooseFromList(inputElement, objectType) {
  console.log(`Opening Choose From List for object type: ${objectType}`);

  // Real implementation would open SAP B1 Choose From List
  // and set the selected value back to the input

  // Simulate choosing a value (for demo purposes)
  setTimeout(() => {
    if (objectType === '2') {
      inputElement.value = 'C20000';
      inputElement.dispatchEvent(new Event('change'));
    } else if (objectType === '4') {
      inputElement.value = 'A00001';
      inputElement.dispatchEvent(new Event('change'));
    }
  }, 100);
}

// Auto-activate/deactivate LinkedButton based on linked input value
function updateLinkedButtonState(inputElement) {
  const linkedButtons = document.querySelectorAll(`[data-link-to="${inputElement.id}"]`);

  linkedButtons.forEach(button => {
    const autoActivate = button.getAttribute('data-auto-activate') === 'true';
    if (autoActivate) {
      const hasValue = inputElement.value.trim().length > 0;
      button.disabled = !hasValue;

      if (hasValue) {
        button.classList.remove('sbo-linked-button--disabled');
      } else {
        button.classList.add('sbo-linked-button--disabled');
      }
    }
  });
}

// EditText + LinkedButton kombinasyonu için helper function
function createLinkedEditTextCombo(options = {}) {
  const {
    uniqueId = 'linkedCombo_' + Date.now(),
    labelText = 'Field',
    linkedObject = '2',
    inputWidth = '120px',
    isRequired = false,
    placeholder = ''
  } = options;

  const editTextId = `${uniqueId}_input`;
  const linkedButtonId = `${uniqueId}_btn`;

  const staticText = createSBOStaticText({
    caption: labelText,
    linkTo: editTextId,
    isRequired: isRequired
  });

  const editText = createSBOEditText({
    uniqueId: editTextId,
    width: inputWidth,
    placeholder: placeholder,
    onKeyup: `updateLinkedButtonState(this)`,
    onChange: `updateLinkedButtonState(this)`
  });

  const linkedButton = createSBOLinkedButton({
    uniqueId: linkedButtonId,
    linkTo: editTextId,
    linkedObject: linkedObject,
    isDisabled: true // Initially disabled until input has value
  });

  return `
    <div class="sbo-field-group">
      ${staticText}
      <div class="sbo-input-group">
        ${editText}
        ${linkedButton}
      </div>
    </div>
  `;
}

// =============================================================================
// 4. BUTTON (STANDART DÜĞME) BİLEŞENİ
// =============================================================================

function createSBOButton(options = {}) {
  const {
    uniqueId = 'btn_' + Date.now(),
    caption = 'Button',
    buttonType = 'text',
    iconPath = null,
    width = 'auto',
    height = '23px',
    minWidth = '75px',
    isDisabled = false,
    isPrimary = false,
    isCancel = false,
    tabIndex = null,
    onClick = null
  } = options;

  const disabledClass = isDisabled ? 'sbo-button--disabled' : '';
  const primaryClass = isPrimary ? 'sbo-button--primary' : '';
  const cancelClass = isCancel ? 'sbo-button--cancel' : '';
  const imageClass = buttonType === 'image' ? 'sbo-button--image' : '';

  const disabledAttr = isDisabled ? 'disabled' : '';
  const tabIndexAttr = tabIndex ? `tabindex="${tabIndex}"` : '';
  const onClickAttr = onClick ? `onclick="${onClick}"` : '';

  let buttonContent = '';
  if (buttonType === 'image' && iconPath) {
    buttonContent = `<img src="${iconPath}" alt="${caption}" class="sbo-button__icon" />`;
  } else {
    buttonContent = caption;
  }

  const specialStyles = [];
  if (isPrimary) {
    specialStyles.push('border-left: 3px solid var(--sbo-color-button-add-accent);');
  }

  const styleAttr = [
    `width: ${width};`,
    `height: ${height};`,
    `min-width: ${minWidth};`,
    ...specialStyles
  ].join(' ');

  return `
    <button type="button"
            id="${uniqueId}"
            class="sbo-button ${disabledClass} ${primaryClass} ${cancelClass} ${imageClass}"
            style="${styleAttr}"
            ${disabledAttr}
            ${tabIndexAttr}
            ${onClickAttr}
            onmousedown="handleButtonMouseDown(this)"
            onmouseup="handleButtonMouseUp(this)"
            onmouseleave="handleButtonMouseLeave(this)">
      ${buttonContent}
    </button>
  `;
}

function handleButtonMouseDown(button) {
  if (!button.disabled) {
    button.classList.add('sbo-button--pressed');
  }
}

function handleButtonMouseUp(button) {
  button.classList.remove('sbo-button--pressed');
}

function handleButtonMouseLeave(button) {
  button.classList.remove('sbo-button--pressed');
}

function createSBOAddButton(options = {}) {
  return createSBOButton({
    ...options,
    caption: options.caption || 'Ekle',
    isPrimary: true,
    onClick: options.onClick || 'handleAddButton()'
  });
}

function createSBOUpdateButton(options = {}) {
  return createSBOButton({
    ...options,
    caption: options.caption || 'Güncelle',
    isPrimary: true,
    onClick: options.onClick || 'handleUpdateButton()'
  });
}

function createSBOCancelButton(options = {}) {
  return createSBOButton({
    ...options,
    caption: options.caption || 'İptal',
    isCancel: true,
    onClick: options.onClick || 'handleCancelButton()'
  });
}

function createSBOOKButton(options = {}) {
  return createSBOButton({
    ...options,
    caption: options.caption || 'Tamam',
    isPrimary: true,
    onClick: options.onClick || 'handleOKButton()'
  });
}

function handleAddButton() {
  console.log('Add button clicked');
}

function handleUpdateButton() {
  console.log('Update button clicked');
}

function handleCancelButton() {
  console.log('Cancel button clicked');
}

function handleOKButton() {
  console.log('OK button clicked');
}

// =============================================================================
// 5. CHECKBOX (ONAY KUTUSU) BİLEŞENİ
// =============================================================================

function createSBOCheckBox(options = {}) {
  const {
    uniqueId = 'chk_' + Date.now(),
    caption = 'Checkbox',
    isChecked = false,
    isDisabled = false,
    isReadOnly = false,
    dataSource = null,
    tabIndex = null,
    labelPosition = 'right',
    onChange = null
  } = options;

  const checkedAttr = isChecked ? 'checked' : '';
  const disabledAttr = isDisabled ? 'disabled' : '';
  const readOnlyAttr = isReadOnly ? 'readonly' : '';
  const tabIndexAttr = tabIndex ? `tabindex="${tabIndex}"` : '';
  const onChangeAttr = onChange ? `onchange="${onChange}"` : '';

  const disabledClass = isDisabled ? 'sbo-checkbox--disabled' : '';
  const readOnlyClass = isReadOnly ? 'sbo-checkbox--readonly' : '';

  const dataAttribute = dataSource ? `data-source="${dataSource}"` : '';

  const checkboxInput = `
    <input type="checkbox"
           id="${uniqueId}"
           class="sbo-checkbox__input"
           ${checkedAttr}
           ${disabledAttr}
           ${readOnlyAttr}
           ${tabIndexAttr}
           ${dataAttribute}
           ${onChangeAttr}
           onchange="handleCheckBoxChange(this)" />
  `;

  const checkboxLabel = `
    <span class="sbo-checkbox__label">${caption}</span>
  `;

  const checkboxContent = labelPosition === 'left'
    ? `${checkboxLabel}${checkboxInput}`
    : `${checkboxInput}${checkboxLabel}`;

  return `
    <label class="sbo-checkbox ${disabledClass} ${readOnlyClass}"
           for="${uniqueId}">
      ${checkboxContent}
    </label>
  `;
}

function handleCheckBoxChange(checkbox) {
  const event = new CustomEvent('sboCheckBoxChanged', {
    detail: {
      checkbox: checkbox,
      checked: checkbox.checked,
      uniqueId: checkbox.id
    }
  });
  document.dispatchEvent(event);

  const dataSource = checkbox.getAttribute('data-source');
  if (dataSource) {
    updateDataSource(dataSource, checkbox.checked);
  }
}

function updateDataSource(dataSource, value) {
  console.log(`Updating DataSource ${dataSource} with value: ${value}`);
}

// =============================================================================
// YARDIMCI FONKSİYONLAR
// =============================================================================

function createSBOInputWithLinkedButton(options = {}) {
  const {
    labelText = 'Müşteri Kodu',
    editTextId = 'customerCode',
    linkedObject = '2',
    isRequired = false
  } = options;

  const staticText = createSBOStaticText({
    caption: labelText,
    linkTo: editTextId,
    isRequired: isRequired
  });

  const editText = createSBOEditText({
    uniqueId: editTextId,
    linkedObject: linkedObject
  });

  const linkedButton = createSBOLinkedButton({
    linkTo: editTextId,
    linkedObject: linkedObject
  });

  return `
    <div class="sbo-field-group">
      ${staticText}
      <div class="sbo-input-group">
        ${editText}
        ${linkedButton}
      </div>
    </div>
  `;
}

// =============================================================================
// 6. COMBOBOX (AÇILIR LİSTE) BİLEŞENİ
// =============================================================================

function createSBOComboBox(options = {}) {
  const {
    uniqueId = 'combo_' + Date.now(),
    width = '120px',
    height = '21px',
    isDisabled = false,
    isReadOnly = false,
    selectedValue = '',
    validValues = [],
    values = [],
    dataSource = null,
    tabIndex = null,
    onChange = null,
    allowEmpty = true
  } = options;

  // values ve validValues için uyumluluk - ikisi de kullanılabilir
  const comboValues = values.length > 0 ? values : validValues;

  const disabledClass = isDisabled ? 'sbo-combobox--disabled' : '';
  const readOnlyClass = isReadOnly ? 'sbo-combobox--readonly' : '';

  const disabledAttr = isDisabled ? 'disabled' : '';
  const readOnlyAttr = isReadOnly ? 'readonly' : '';
  const tabIndexAttr = tabIndex ? `tabindex="${tabIndex}"` : '';
  const onChangeAttr = onChange ? `onchange="${onChange}"` : '';

  const dataAttribute = dataSource ? `data-source="${dataSource}"` : '';

  let optionsHTML = '';

  if (allowEmpty) {
    optionsHTML += '<option value=""></option>';
  }

  comboValues.forEach(item => {
    const selected = item.value === selectedValue ? 'selected' : '';
    const displayText = item.text || item.description || item.value;
    optionsHTML += `<option value="${item.value}" ${selected}>${displayText}</option>`;
  });

  return `
    <select id="${uniqueId}"
            class="sbo-combobox ${disabledClass} ${readOnlyClass}"
            style="width: ${width}; height: ${height};"
            ${disabledAttr}
            ${readOnlyAttr}
            ${tabIndexAttr}
            ${dataAttribute}
            ${onChangeAttr}
            onfocus="handleComboBoxFocus(this)"
            onblur="handleComboBoxBlur(this)"
            onchange="handleComboBoxChange(this)">
      ${optionsHTML}
    </select>
  `;
}

function handleComboBoxFocus(combobox) {
  combobox.classList.add('sbo-combobox--focused');
}

function handleComboBoxBlur(combobox) {
  combobox.classList.remove('sbo-combobox--focused');
}

function handleComboBoxChange(combobox) {
  const event = new CustomEvent('sboComboBoxChanged', {
    detail: {
      combobox: combobox,
      value: combobox.value,
      text: combobox.options[combobox.selectedIndex]?.text || '',
      uniqueId: combobox.id
    }
  });
  document.dispatchEvent(event);

  const dataSource = combobox.getAttribute('data-source');
  if (dataSource) {
    updateDataSource(dataSource, combobox.value);
  }
}

// =============================================================================
// 7. EXTENDEDEDITTEXT (ÇOK SATIRLI METİN KUTUSU) BİLEŞENİ
// =============================================================================

function createSBOExtendedEditText(options = {}) {
  const {
    uniqueId = 'extEditText_' + Date.now(),
    value = '',
    placeholder = '',
    width = '300px',
    height = '100px',
    rows = 5,
    cols = 40,
    isDisabled = false,
    isReadOnly = false,
    isRequired = false,
    maxLength = null,
    dataSource = null,
    tabIndex = null,
    resize = 'none'
  } = options;

  const disabledClass = isDisabled ? 'sbo-extended-edittext--disabled' : '';
  const readOnlyClass = isReadOnly ? 'sbo-extended-edittext--readonly' : '';
  const requiredClass = isRequired ? 'sbo-extended-edittext--required' : '';

  const disabledAttr = isDisabled ? 'disabled' : '';
  const readOnlyAttr = isReadOnly ? 'readonly' : '';
  const maxLengthAttr = maxLength ? `maxlength="${maxLength}"` : '';
  const tabIndexAttr = tabIndex ? `tabindex="${tabIndex}"` : '';

  const dataAttribute = dataSource ? `data-source="${dataSource}"` : '';

  return `
    <textarea id="${uniqueId}"
              class="sbo-extended-edittext ${disabledClass} ${readOnlyClass} ${requiredClass}"
              style="width: ${width}; height: ${height}; resize: ${resize};"
              rows="${rows}"
              cols="${cols}"
              placeholder="${placeholder}"
              ${disabledAttr}
              ${readOnlyAttr}
              ${maxLengthAttr}
              ${tabIndexAttr}
              ${dataAttribute}
              onfocus="handleExtendedEditTextFocus(this)"
              onblur="handleExtendedEditTextBlur(this)"
              onchange="handleExtendedEditTextChange(this)">${value}</textarea>
  `;
}

function handleExtendedEditTextFocus(textarea) {
  textarea.classList.add('sbo-extended-edittext--focused');
}

function handleExtendedEditTextBlur(textarea) {
  textarea.classList.remove('sbo-extended-edittext--focused');
}

function handleExtendedEditTextChange(textarea) {
  const event = new CustomEvent('sboExtendedEditTextChanged', {
    detail: {
      textarea: textarea,
      value: textarea.value,
      uniqueId: textarea.id
    }
  });
  document.dispatchEvent(event);

  const dataSource = textarea.getAttribute('data-source');
  if (dataSource) {
    updateDataSource(dataSource, textarea.value);
  }
}

// =============================================================================
// 8. OPTIONBUTTON (RADYO DÜĞMESİ) BİLEŞENİ
// =============================================================================

function createSBOOptionButton(options = {}) {
  const {
    uniqueId = 'optBtn_' + Date.now(),
    name = 'optionGroup_' + Date.now(),
    caption = 'Radio',
    value = '',
    isChecked = false,
    isDisabled = false,
    isReadOnly = false,
    dataSource = null,
    tabIndex = null,
    labelPosition = 'right',
    onChange = null
  } = options;

  const checkedAttr = isChecked ? 'checked' : '';
  const disabledAttr = isDisabled ? 'disabled' : '';
  const readOnlyAttr = isReadOnly ? 'readonly' : '';
  const tabIndexAttr = tabIndex ? `tabindex="${tabIndex}"` : '';
  const onChangeAttr = onChange ? `onchange="${onChange}"` : '';

  const disabledClass = isDisabled ? 'sbo-option-button--disabled' : '';
  const readOnlyClass = isReadOnly ? 'sbo-option-button--readonly' : '';

  const dataAttribute = dataSource ? `data-source="${dataSource}"` : '';

  const radioInput = `
    <input type="radio"
           id="${uniqueId}"
           name="${name}"
           value="${value}"
           class="sbo-option-button__input"
           ${checkedAttr}
           ${disabledAttr}
           ${readOnlyAttr}
           ${tabIndexAttr}
           ${dataAttribute}
           ${onChangeAttr}
           onchange="handleOptionButtonChange(this)" />
  `;

  const radioLabel = `
    <span class="sbo-option-button__label">${caption}</span>
  `;

  const radioContent = labelPosition === 'left'
    ? `${radioLabel}${radioInput}`
    : `${radioInput}${radioLabel}`;

  return `
    <label class="sbo-option-button ${disabledClass} ${readOnlyClass}"
           for="${uniqueId}">
      ${radioContent}
    </label>
  `;
}

function handleOptionButtonChange(radio) {
  const radioGroup = document.querySelectorAll(`input[name="${radio.name}"]`);
  radioGroup.forEach(r => {
    const container = r.closest('.sbo-option-button');
    if (container) {
      container.classList.toggle('sbo-option-button--selected', r.checked);
    }
  });

  const event = new CustomEvent('sboOptionButtonChanged', {
    detail: {
      radio: radio,
      value: radio.value,
      name: radio.name,
      uniqueId: radio.id
    }
  });
  document.dispatchEvent(event);

  const dataSource = radio.getAttribute('data-source');
  if (dataSource) {
    updateDataSource(dataSource, radio.value);
  }
}

// =============================================================================
// 9. TABCONTROL (SEKME KONTROLÜ) BİLEŞENİ
// =============================================================================

function createSBOTabControl(options = {}) {
  const {
    uniqueId = 'tabControl_' + Date.now(),
    width = '100%',
    height = '300px',
    tabs = [],
    activeTabId = null,
    autoPaneSelection = true,
    isDisabled = false
  } = options;

  const disabledClass = isDisabled ? 'sbo-tab-control--disabled' : '';
  const activeTab = activeTabId || (tabs.length > 0 ? tabs[0].id : null);

  const tabHeaders = tabs.map(tab => {
    const activeClass = tab.id === activeTab ? 'sbo-tab-header--active' : '';
    const disabledTabClass = tab.isDisabled ? 'sbo-tab-header--disabled' : '';

    return `
      <button type="button"
              class="sbo-tab-header ${activeClass} ${disabledTabClass}"
              data-tab-id="${tab.id}"
              data-pane="${tab.pane || 1}"
              ${tab.isDisabled ? 'disabled' : ''}
              onclick="handleTabClick(this, '${uniqueId}')">
        ${tab.caption}
      </button>
    `;
  }).join('');

  const tabContents = tabs.map(tab => {
    const activeClass = tab.id === activeTab ? 'sbo-tab-content--active' : '';

    return `
      <div class="sbo-tab-content ${activeClass}"
           data-tab-id="${tab.id}"
           data-pane="${tab.pane || 1}">
        ${tab.content || ''}
      </div>
    `;
  }).join('');

  return `
    <div id="${uniqueId}"
         class="sbo-tab-control ${disabledClass}"
         style="width: ${width}; height: ${height};"
         data-auto-pane-selection="${autoPaneSelection}">

      <div class="sbo-tab-headers">
        ${tabHeaders}
      </div>

      <div class="sbo-tab-container">
        ${tabContents}
      </div>
    </div>
  `;
}

function handleTabClick(tabHeader, tabControlId) {
  if (tabHeader.disabled) return;

  const tabControl = document.getElementById(tabControlId);
  if (!tabControl) return;

  const tabId = tabHeader.getAttribute('data-tab-id');
  const pane = tabHeader.getAttribute('data-pane');

  const allHeaders = tabControl.querySelectorAll('.sbo-tab-header');
  allHeaders.forEach(header => {
    header.classList.remove('sbo-tab-header--active');
  });

  const allContents = tabControl.querySelectorAll('.sbo-tab-content');
  allContents.forEach(content => {
    content.classList.remove('sbo-tab-content--active');
  });

  tabHeader.classList.add('sbo-tab-header--active');

  const targetContent = tabControl.querySelector(`[data-tab-id="${tabId}"]`);
  if (targetContent) {
    targetContent.classList.add('sbo-tab-content--active');
  }

  const event = new CustomEvent('sboTabChanged', {
    detail: {
      tabId: tabId,
      pane: pane,
      tabControl: tabControl
    }
  });
  document.dispatchEvent(event);
}

// =============================================================================
// 10. GRID (IZGARA) BİLEŞENİ
// =============================================================================

function createSBOGrid(options = {}) {
  const {
    uniqueId = 'grid_' + Date.now(),
    width = '100%',
    height = '300px',
    columns = [],
    data = [],
    allowSorting = true,
    allowSelection = true,
    showRowNumbers = true,
    showGridLines = true,
    alternateRowColor = true,
    isDisabled = false,
    dataTable = null
  } = options;

  const disabledClass = isDisabled ? 'sbo-grid--disabled' : '';
  const dataTableAttr = dataTable ? `data-table="${dataTable}"` : '';

  const headerRow = createGridHeaderRow(columns, showRowNumbers, allowSorting);
  const dataRows = createGridDataRows(data, columns, showRowNumbers, alternateRowColor, allowSelection);

  return `
    <div id="${uniqueId}"
         class="sbo-grid ${disabledClass}"
         style="width: ${width}; height: ${height};"
         ${dataTableAttr}
         data-allow-sorting="${allowSorting}"
         data-allow-selection="${allowSelection}">

      <div class="sbo-grid-container">
        <table class="sbo-grid-table">
          <thead class="sbo-grid-header">
            ${headerRow}
          </thead>
          <tbody class="sbo-grid-body">
            ${dataRows}
          </tbody>
        </table>
      </div>

      <div class="sbo-grid-footer">
        <span class="sbo-grid-record-count">Kayıt sayısı: ${data.length}</span>
      </div>
    </div>
  `;
}

function createGridHeaderRow(columns, showRowNumbers, allowSorting) {
  let headerCells = '';

  if (showRowNumbers) {
    headerCells += `
      <th class="sbo-grid-header-cell sbo-grid-header-cell--row-number">
        <div class="sbo-grid-header-content">
          <span class="sbo-grid-row-number-icon">#</span>
        </div>
      </th>
    `;
  }

  columns.forEach(column => {
    if (!column.visible) return;

    const sortClass = allowSorting ? 'sbo-grid-header-cell--sortable' : '';
    const sortIcon = allowSorting ? '<span class="sbo-grid-sort-icon"></span>' : '';

    headerCells += `
      <th class="sbo-grid-header-cell ${sortClass}"
          style="width: ${column.width || 'auto'};"
          data-column-id="${column.id}"
          data-data-type="${column.dataType || 'string'}"
          onclick="${allowSorting ? `handleGridSort(this, '${column.id}')` : ''}">
        <div class="sbo-grid-header-content">
          <span class="sbo-grid-header-text">${column.title}</span>
          ${sortIcon}
        </div>
      </th>
    `;
  });

  return `<tr class="sbo-grid-header-row">${headerCells}</tr>`;
}

function createGridDataRows(data, columns, showRowNumbers, alternateRowColor, allowSelection) {
  return data.map((row, index) => {
    const rowClass = alternateRowColor && index % 2 === 1 ? 'sbo-grid-row--alternate' : '';
    const selectableClass = allowSelection ? 'sbo-grid-row--selectable' : '';

    let cells = '';

    if (showRowNumbers) {
      cells += `
        <td class="sbo-grid-cell sbo-grid-cell--row-number">
          <span class="sbo-grid-row-number">${index + 1}</span>
        </td>
      `;
    }

    columns.forEach(column => {
      if (!column.visible) return;

      const value = row[column.id] || '';
      const formattedValue = formatGridCellValue(value, column.dataType);
      const alignClass = getGridCellAlignClass(column.dataType);

      cells += `
        <td class="sbo-grid-cell ${alignClass}"
            data-column-id="${column.id}"
            data-value="${value}">
          <span class="sbo-grid-cell-content">${formattedValue}</span>
        </td>
      `;
    });

    return `
      <tr class="sbo-grid-row ${rowClass} ${selectableClass}"
          data-row-index="${index}"
          onclick="${allowSelection ? `handleGridRowClick(this)` : ''}">
        ${cells}
      </tr>
    `;
  }).join('');
}

function formatGridCellValue(value, dataType) {
  if (value === null || value === undefined || value === '') return '';

  switch (dataType) {
    case 'number':
    case 'currency':
      return typeof value === 'number' ? value.toLocaleString('tr-TR') : value;
    case 'date':
      return value instanceof Date ? value.toLocaleDateString('tr-TR') : value;
    case 'boolean':
      return value ? 'Evet' : 'Hayır';
    case 'percentage':
      return typeof value === 'number' ? `${value}%` : value;
    default:
      return value.toString();
  }
}

function getGridCellAlignClass(dataType) {
  switch (dataType) {
    case 'number':
    case 'currency':
    case 'percentage':
      return 'sbo-grid-cell--right';
    case 'date':
      return 'sbo-grid-cell--center';
    default:
      return 'sbo-grid-cell--left';
  }
}

function handleGridSort(headerCell, columnId) {
  const grid = headerCell.closest('.sbo-grid');
  const currentSort = headerCell.getAttribute('data-sort') || 'none';

  grid.querySelectorAll('.sbo-grid-header-cell').forEach(cell => {
    cell.removeAttribute('data-sort');
    const icon = cell.querySelector('.sbo-grid-sort-icon');
    if (icon) icon.className = 'sbo-grid-sort-icon';
  });

  let newSort = 'asc';
  if (currentSort === 'asc') newSort = 'desc';
  else if (currentSort === 'desc') newSort = 'none';

  headerCell.setAttribute('data-sort', newSort);
  const sortIcon = headerCell.querySelector('.sbo-grid-sort-icon');
  if (sortIcon) {
    sortIcon.className = `sbo-grid-sort-icon sbo-grid-sort-icon--${newSort}`;
  }

  const event = new CustomEvent('sboGridSort', {
    detail: {
      columnId: columnId,
      direction: newSort,
      grid: grid
    }
  });
  document.dispatchEvent(event);
}

function handleGridRowClick(row) {
  const grid = row.closest('.sbo-grid');

  grid.querySelectorAll('.sbo-grid-row').forEach(r => {
    r.classList.remove('sbo-grid-row--selected');
  });

  row.classList.add('sbo-grid-row--selected');

  const rowIndex = parseInt(row.getAttribute('data-row-index'));

  const event = new CustomEvent('sboGridRowSelected', {
    detail: {
      rowIndex: rowIndex,
      row: row,
      grid: grid
    }
  });
  document.dispatchEvent(event);
}

// =============================================================================
// 11. MATRIX (MATRİS) BİLEŞENİ
// =============================================================================

function createSBOMatrix(options = {}) {
  const {
    uniqueId = 'matrix_' + Date.now(),
    width = '100%',
    height = '300px',
    columns = [],
    rowCount = 10,
    showRowNumbers = true,
    allowAddRow = true,
    allowDeleteRow = true,
    allowRowSelection = true,
    isDisabled = false,
    dataTable = null
  } = options;

  const disabledClass = isDisabled ? 'sbo-matrix-wrapper--disabled' : '';
  const dataTableAttr = dataTable ? `data-table="${dataTable}"` : '';

  const headerRow = createMatrixHeaderRow(columns, showRowNumbers);
  const dataRows = createMatrixDataRows(columns, rowCount, showRowNumbers, allowRowSelection, uniqueId);

  return `
    <div id="${uniqueId}"
         class="sbo-matrix-wrapper ${disabledClass}"
         style="width: ${width};"
         ${dataTableAttr}
         data-allow-add-row="${allowAddRow}"
         data-allow-delete-row="${allowDeleteRow}"
         data-row-count="${rowCount}">

      <div class="sbo-matrix-container">
        <table class="sbo-matrix-table">
          <thead class="sbo-matrix-header">
            ${headerRow}
          </thead>
          <tbody class="sbo-matrix-body">
            ${dataRows}
          </tbody>
        </table>
      </div>

      <div class="sbo-matrix-controls">
        <button class="sbo-matrix-btn sbo-matrix-btn--up" onclick="handleMatrixScrollUp('${uniqueId}')">▲</button>
        <button class="sbo-matrix-btn sbo-matrix-btn--down" onclick="handleMatrixScrollDown('${uniqueId}')">▼</button>
      </div>
    </div>
  `;
}

function createMatrixHeaderRow(columns, showRowNumbers) {
  let headerCells = '';

  if (showRowNumbers) {
    headerCells += `
      <th class="sbo-matrix-header-cell sbo-matrix-header-cell--row-number">
        <div class="sbo-matrix-header-content">
          <span class="sbo-matrix-row-number-icon">#</span>
        </div>
      </th>
    `;
  }

  columns.forEach(column => {
    if (!column.visible) return;

    headerCells += `
      <th class="sbo-matrix-header-cell"
          style="width: ${column.width || 'auto'};"
          data-column-id="${column.id}"
          data-column-type="${column.type || 'EditText'}">
        <div class="sbo-matrix-header-content">
          <span class="sbo-matrix-header-text">${column.title}</span>
        </div>
      </th>
    `;
  });

  return `<tr class="sbo-matrix-header-row">${headerCells}</tr>`;
}

function createMatrixDataRows(columns, rowCount, showRowNumbers, allowRowSelection, matrixId) {
  const rows = [];

  for (let i = 0; i < rowCount; i++) {
    const selectableClass = allowRowSelection ? 'sbo-matrix-row--selectable' : '';

    let cells = '';

    if (showRowNumbers) {
      cells += `
        <td class="sbo-matrix-cell sbo-matrix-cell--row-number"
            onclick="handleMatrixRowNumberClick(this, ${i})">
          <span class="sbo-matrix-row-number">${i + 1}</span>
        </td>
      `;
    }

    columns.forEach(column => {
      if (!column.visible) return;

      const cellId = `${matrixId}_${i}_${column.id}`;
      const cellContent = createMatrixCellContent(column, cellId, i);

      cells += `
        <td class="sbo-matrix-cell sbo-matrix-cell--data"
            data-column-id="${column.id}"
            data-row-index="${i}">
          ${cellContent}
        </td>
      `;
    });

    rows.push(`
      <tr class="sbo-matrix-row ${selectableClass}"
          data-row-index="${i}">
        ${cells}
      </tr>
    `);
  }

  return rows.join('');
}

function createMatrixCellContent(column, cellId, rowIndex) {
  const baseOptions = {
    uniqueId: cellId,
    dataSource: column.dataSource,
    width: '100%',
    height: '100%',
    isDisabled: !column.editable,
    tabIndex: (rowIndex * 100) + parseInt(column.tabOrder || 0)
  };

  switch (column.type) {
    case 'edittext':
      return createSBOEditText({
        ...baseOptions,
        value: '',
        isPassword: column.isPassword || false,
        maxLength: column.maxLength
      });

    case 'combobox':
      return createSBOComboBox({
        ...baseOptions,
        values: column.values || [],
        selectedValue: '',
        allowEmpty: column.allowEmpty !== false
      });

    case 'CheckBox':
      return createSBOCheckBox({
        ...baseOptions,
        caption: '',
        labelPosition: 'left'
      });

    case 'LinkedButton':
      const editText = createSBOEditText({
        ...baseOptions,
        linkedObject: column.linkedObject
      });
      const linkedButton = createSBOLinkedButton({
        linkTo: cellId,
        linkedObject: column.linkedObject
      });
      return `
        <div class="sbo-matrix-input-group">
          ${editText}
          ${linkedButton}
        </div>
      `;

    case 'static':
      return '';

    default:
      return createSBOEditText({...baseOptions, value: ''});
  }
}

function handleMatrixScrollUp(matrixId) {
  const matrix = document.getElementById(matrixId);
  if (!matrix) return;

  const container = matrix.querySelector('.sbo-matrix-container');
  if (container) {
    container.scrollTop -= 30;
  }
}

function handleMatrixScrollDown(matrixId) {
  const matrix = document.getElementById(matrixId);
  if (!matrix) return;

  const container = matrix.querySelector('.sbo-matrix-container');
  if (container) {
    container.scrollTop += 30;
  }
}

function createMatrixControlButtons(matrixId, allowAddRow, allowDeleteRow) {
  let buttons = '';

  if (allowAddRow) {
    buttons += `
      <button type="button"
              class="sbo-matrix-control-btn sbo-matrix-control-btn--add"
              onclick="handleMatrixAddRow('${matrixId}')"
              title="Satır Ekle">
        <span class="sbo-matrix-control-icon">+</span>
      </button>
    `;
  }

  if (allowDeleteRow) {
    buttons += `
      <button type="button"
              class="sbo-matrix-control-btn sbo-matrix-control-btn--delete"
              onclick="handleMatrixDeleteRow('${matrixId}')"
              title="Satır Sil">
        <span class="sbo-matrix-control-icon">-</span>
      </button>
    `;
  }

  return `
    <div class="sbo-matrix-controls">
      ${buttons}
    </div>
  `;
}

function handleMatrixRowNumberClick(cell, rowIndex) {
  const matrix = cell.closest('.sbo-matrix');
  const row = cell.closest('.sbo-matrix-row');

  matrix.querySelectorAll('.sbo-matrix-row').forEach(r => {
    r.classList.remove('sbo-matrix-row--selected');
  });

  row.classList.add('sbo-matrix-row--selected');

  const event = new CustomEvent('sboMatrixRowSelected', {
    detail: {
      rowIndex: rowIndex,
      row: row,
      matrix: matrix
    }
  });
  document.dispatchEvent(event);
}

function handleMatrixAddRow(matrixId) {
  const matrix = document.getElementById(matrixId);
  if (!matrix) return;

  console.log(`Adding row to matrix: ${matrixId}`);

  const event = new CustomEvent('sboMatrixRowAdded', {
    detail: {
      matrix: matrix
    }
  });
  document.dispatchEvent(event);
}

function handleMatrixDeleteRow(matrixId) {
  const matrix = document.getElementById(matrixId);
  if (!matrix) return;

  const selectedRow = matrix.querySelector('.sbo-matrix-row--selected');
  if (!selectedRow) {
    alert('Silmek için bir satır seçiniz.');
    return;
  }

  console.log(`Deleting row from matrix: ${matrixId}`);

  const event = new CustomEvent('sboMatrixRowDeleted', {
    detail: {
      matrix: matrix
    }
  });
  document.dispatchEvent(event);
}

// =============================================================================
// 12. PICTUREBOX (RESİM KUTUSU) BİLEŞENİ
// =============================================================================

function createSBOPictureBox(options = {}) {
  const {
    uniqueId = 'pictureBox_' + Date.now(),
    width = '150px',
    height = '150px',
    imagePath = '',
    altText = 'Resim',
    isDisabled = false,
    allowClick = false,
    dataSource = null,
    borderStyle = 'solid',
    fit = 'contain'
  } = options;

  const disabledClass = isDisabled ? 'sbo-picture-box--disabled' : '';
  const clickableClass = allowClick ? 'sbo-picture-box--clickable' : '';
  const dataAttribute = dataSource ? `data-source="${dataSource}"` : '';
  const clickHandler = allowClick ? `onclick="handlePictureBoxClick(this)"` : '';

  const imageElement = imagePath ?
    `<img src="${imagePath}" alt="${altText}" class="sbo-picture-box__image" style="object-fit: ${fit};" />` :
    `<div class="sbo-picture-box__placeholder">Resim Yok</div>`;

  return `
    <div id="${uniqueId}"
         class="sbo-picture-box ${disabledClass} ${clickableClass}"
         style="width: ${width}; height: ${height}; border-style: ${borderStyle};"
         ${dataAttribute}
         ${clickHandler}
         title="${altText}">
      ${imageElement}
    </div>
  `;
}

function handlePictureBoxClick(pictureBox) {
  if (pictureBox.classList.contains('sbo-picture-box--disabled')) return;

  const event = new CustomEvent('sboPictureBoxClicked', {
    detail: {
      pictureBox: pictureBox,
      uniqueId: pictureBox.id
    }
  });
  document.dispatchEvent(event);
}

// =============================================================================
// 13. BUTTONCOMBO (DÜĞME KOMBİNASYONU) BİLEŞENİ
// =============================================================================

function createSBOButtonCombo(options = {}) {
  const {
    uniqueId = 'buttonCombo_' + Date.now(),
    width = '150px',
    height = '21px',
    buttonCaption = 'Eylem',
    validValues = [],
    selectedValue = '',
    isDisabled = false,
    dataSource = null,
    onButtonClick = null,
    onSelectionChange = null
  } = options;

  const disabledClass = isDisabled ? 'sbo-button-combo--disabled' : '';
  const disabledAttr = isDisabled ? 'disabled' : '';
  const dataAttribute = dataSource ? `data-source="${dataSource}"` : '';

  // Button click handler attribute
  const buttonClickAttr = onButtonClick ? `onclick="${onButtonClick}"` : '';
  const selectionChangeAttr = onSelectionChange ? `data-on-change="${onSelectionChange}"` : '';

  // Dropdown seçeneklerini oluştur
  let optionsHTML = '';
  validValues.forEach(item => {
    const selectedClass = item.value === selectedValue ? 'sbo-button-combo__option--selected' : '';
    optionsHTML += `
      <div class="sbo-button-combo__option ${selectedClass}"
           data-value="${item.value}"
           onclick="selectButtonComboOption('${uniqueId}', '${item.value}', '${item.description}')">
        ${item.description}
      </div>
    `;
  });

  return `
    <div id="${uniqueId}"
         class="sbo-button-combo ${disabledClass}"
         style="width: ${width}; height: ${height};"
         ${dataAttribute}
         ${selectionChangeAttr}>

      <!-- Ana Eylem Düğmesi -->
      <button type="button"
              class="sbo-button-combo__button"
              onclick="handleButtonComboMainClick('${uniqueId}')"
              ${buttonClickAttr}
              ${disabledAttr}>
        <span class="sbo-button-combo__text">${buttonCaption}</span>
      </button>

      <!-- Dropdown Üçgeni -->
      <button type="button"
              class="sbo-button-combo__arrow-btn"
              onclick="toggleButtonComboDropdown('${uniqueId}')"
              ${disabledAttr}
              title="Seçenekleri Göster">
        ◢
      </button>

      <!-- Dropdown Seçenekler Listesi -->
      <div class="sbo-button-combo__dropdown">
        ${optionsHTML}
      </div>

      <!-- Gizli select input (DataSource bağlaması için) -->
      <select class="sbo-button-combo__hidden-select"
              name="${dataSource || uniqueId}"
              style="display: none;">
        ${validValues.map(item =>
          `<option value="${item.value}" ${item.value === selectedValue ? 'selected' : ''}>${item.description}</option>`
        ).join('')}
      </select>
    </div>
  `;
}

// ButtonCombo JavaScript fonksiyonları

// Ana düğme tıklaması - birincil eylem
function handleButtonComboMainClick(uniqueId) {
  const container = document.getElementById(uniqueId);
  const hiddenSelect = container.querySelector('.sbo-button-combo__hidden-select');
  const selectedValue = hiddenSelect.value;
  const selectedText = hiddenSelect.options[hiddenSelect.selectedIndex]?.text || '';

  // Ana düğme tıklama event'i
  const event = new CustomEvent('sboButtonComboMainClicked', {
    detail: {
      uniqueId: uniqueId,
      selectedValue: selectedValue,
      selectedText: selectedText,
      action: 'primary'
    }
  });
  document.dispatchEvent(event);
}

// Dropdown açma/kapama - seçenek listesi
function toggleButtonComboDropdown(uniqueId) {
  const container = document.getElementById(uniqueId);
  const dropdown = container.querySelector('.sbo-button-combo__dropdown');

  // Diğer açık dropdown'ları kapat
  document.querySelectorAll('.sbo-button-combo__dropdown.show').forEach(otherDropdown => {
    if (otherDropdown !== dropdown) {
      otherDropdown.classList.remove('show');
    }
  });

  // Bu dropdown'ı aç/kapat
  dropdown.classList.toggle('show');
}

// Dropdown'dan seçenek seçimi
function selectButtonComboOption(uniqueId, value, description) {
  const container = document.getElementById(uniqueId);
  const hiddenSelect = container.querySelector('.sbo-button-combo__hidden-select');
  const dropdown = container.querySelector('.sbo-button-combo__dropdown');

  // Önceki seçili seçeneği temizle
  dropdown.querySelectorAll('.sbo-button-combo__option--selected').forEach(option => {
    option.classList.remove('sbo-button-combo__option--selected');
  });

  // Yeni seçeneği işaretle
  const selectedOption = dropdown.querySelector(`[data-value="${value}"]`);
  if (selectedOption) {
    selectedOption.classList.add('sbo-button-combo__option--selected');
  }

  // Hidden select'i güncelle
  hiddenSelect.value = value;

  // Dropdown'ı kapat
  dropdown.classList.remove('show');

  // DataSource güncellemesi
  const dataSource = container.getAttribute('data-source');
  if (dataSource) {
    updateDataSource(dataSource, value);
  }

  // Selection change event'i
  const event = new CustomEvent('sboButtonComboSelectionChanged', {
    detail: {
      uniqueId: uniqueId,
      value: value,
      description: description,
      dataSource: dataSource
    }
  });
  document.dispatchEvent(event);

  // Custom onSelectionChange handler varsa çağır
  const onChangeHandler = container.getAttribute('data-on-change');
  if (onChangeHandler && window[onChangeHandler]) {
    window[onChangeHandler](value, description);
  }
}

// Sayfa tıklamasında dropdown'ları kapat
document.addEventListener('click', function(event) {
  if (!event.target.closest('.sbo-button-combo')) {
    document.querySelectorAll('.sbo-button-combo__dropdown.show').forEach(dropdown => {
      dropdown.classList.remove('show');
    });
  }
});

// Örnek kullanım fonksiyonları

// Kopyalama ButtonCombo örneği
function createCopyButtonCombo() {
  return createSBOButtonCombo({
    uniqueId: 'copyDocuments',
    width: '180px',
    buttonCaption: 'Kopyala',
    validValues: [
      { value: 'delivery', description: 'Teslimat' },
      { value: 'invoice', description: 'Müşteri faturası' },
      { value: 'proforma', description: 'Proforma fatura' },
      { value: 'receipt', description: 'Müşteri peşinatı faturası' }
    ],
    selectedValue: 'delivery',
    dataSource: 'targetDocType',
    onButtonClick: 'handleCopyDocument',
    onSelectionChange: 'handleTargetTypeChange'
  });
}

// Yazdırma ButtonCombo örneği
function createPrintButtonCombo() {
  return createSBOButtonCombo({
    uniqueId: 'printOptions',
    width: '160px',
    buttonCaption: 'Yazdır',
    validValues: [
      { value: 'print', description: 'Yazdır' },
      { value: 'preview', description: 'Yazdırma Önizleme' },
      { value: 'pdf', description: 'PDF Olarak Kaydet' },
      { value: 'email', description: 'E-posta Gönder' }
    ],
    selectedValue: 'print',
    dataSource: 'printMethod',
    onButtonClick: 'handlePrintDocument',
    onSelectionChange: 'handlePrintMethodChange'
  });
}

// Event handler örnekleri
function handleCopyDocument() {
  console.log('Kopyalama işlemi başlatıldı');
}

function handleTargetTypeChange(value, description) {
  console.log('Hedef belge türü değişti:', description);
}

function handlePrintDocument() {
  console.log('Yazdırma işlemi başlatıldı');
}

function handlePrintMethodChange(value, description) {
  console.log('Yazdırma yöntemi değişti:', description);
}

// =============================================================================
// PENCERE ŞABLONU (WINDOW TEMPLATE) BİLEŞENİ
// =============================================================================

function createSBOWindow(options = {}) {
  const {
    uniqueId = 'window_' + Date.now(),
    title = 'SAP Business One',
    width = '800px',
    height = '600px',
    showMinimize = true,
    showMaximize = true,
    showClose = true,
    showStrip = true,
    isMaximized = false,
    content = '',
    footer = ''
  } = options;

  const windowClass = isMaximized ? 'sbo-window sbo-window--maximized' : 'sbo-window';
  const stripHTML = showStrip ? '<div class="sbo-topbar-strip"></div>' : '';

  const windowControls = createWindowControls({
    windowId: uniqueId,
    showMinimize,
    showMaximize,
    showClose,
    isMaximized
  });

  return `
    <div id="${uniqueId}"
         class="${windowClass}"
         style="width: ${width}; height: ${height};"
         data-is-maximized="${isMaximized}">

      <div class="sbo-topbar">
        <div class="sbo-topbar__content">
          <div class="sbo-topbar__title"
               contenteditable="false"
               spellcheck="false">
            ${title}
          </div>
        </div>
        ${windowControls}
      </div>

      ${stripHTML}

      <div class="sbo-window__body">
        ${content}
      </div>

      ${footer ? `<div class="sbo-window__footer">${footer}</div>` : ''}
    </div>
  `;
}

function createWindowControls(options = {}) {
  const {
    windowId,
    showMinimize = true,
    showMaximize = true,
    showClose = true,
    isMaximized = false
  } = options;

  let controls = '<div class="sbo-topbar__controls">';

  if (showMinimize) {
    controls += `
      <button type="button"
              class="sbo-window-btn sbo-window-btn--minimize"
              onclick="handleWindowMinimize('${windowId}')"
              title="Simge Durumuna Küçült"
              aria-label="Minimize">
      </button>
    `;
  }

  if (showMaximize) {
    const maximizeClass = isMaximized ? 'sbo-window-btn--restore' : 'sbo-window-btn--maximize';
    const maximizeTitle = isMaximized ? 'Önceki Boyuta Dön' : 'Ekranı Kapla';
    const maximizeLabel = isMaximized ? 'Restore' : 'Maximize';

    controls += `
      <button type="button"
              class="sbo-window-btn ${maximizeClass}"
              onclick="handleWindowMaximize('${windowId}')"
              title="${maximizeTitle}"
              aria-label="${maximizeLabel}">
      </button>
    `;
  }

  if (showClose) {
    controls += `
      <button type="button"
              class="sbo-window-btn sbo-window-btn--close"
              onclick="handleWindowClose('${windowId}')"
              title="Kapat"
              aria-label="Close">
      </button>
    `;
  }

  controls += '</div>';
  return controls;
}

function handleWindowMinimize(windowId) {
  const windowElement = document.getElementById(windowId);
  if (!windowElement) return;

  // Minimize effect - hide window
  const isMinimized = windowElement.getAttribute('data-is-minimized') === 'true';
  const newState = !isMinimized;

  windowElement.setAttribute('data-is-minimized', newState);

  if (newState) {
    // Store original display state
    windowElement.setAttribute('data-original-display', windowElement.style.display || 'flex');
    windowElement.style.display = 'none';
  } else {
    // Restore original display state
    const originalDisplay = windowElement.getAttribute('data-original-display') || 'flex';
    windowElement.style.display = originalDisplay;
  }

  const event = new CustomEvent('sboWindowMinimize', {
    detail: {
      windowId: windowId,
      window: windowElement,
      isMinimized: newState
    }
  });
  document.dispatchEvent(event);

  console.log(`Window minimize state changed: ${windowId}, minimized: ${newState}`);
}

function handleWindowMaximize(windowId) {
  const windowElement = document.getElementById(windowId);
  if (!windowElement) return;

  const isMaximized = windowElement.getAttribute('data-is-maximized') === 'true';
  const newState = !isMaximized;

  windowElement.setAttribute('data-is-maximized', newState);

  if (newState) {
    windowElement.classList.add('sbo-window--maximized');
  } else {
    windowElement.classList.remove('sbo-window--maximized');
  }

  const maximizeBtn = windowElement.querySelector('.sbo-window-btn--maximize, .sbo-window-btn--restore');
  if (maximizeBtn) {
    if (newState) {
      maximizeBtn.classList.remove('sbo-window-btn--maximize');
      maximizeBtn.classList.add('sbo-window-btn--restore');
      maximizeBtn.setAttribute('title', 'Önceki Boyuta Dön');
      maximizeBtn.setAttribute('aria-label', 'Restore');
    } else {
      maximizeBtn.classList.remove('sbo-window-btn--restore');
      maximizeBtn.classList.add('sbo-window-btn--maximize');
      maximizeBtn.setAttribute('title', 'Ekranı Kapla');
      maximizeBtn.setAttribute('aria-label', 'Maximize');
    }
  }

  const event = new CustomEvent('sboWindowMaximize', {
    detail: {
      windowId: windowId,
      window: windowElement,
      isMaximized: newState
    }
  });
  document.dispatchEvent(event);

  console.log(`Window maximize state changed: ${windowId}, maximized: ${newState}`);
}

function handleWindowClose(windowId) {
  const windowElement = document.getElementById(windowId);
  if (!windowElement) return;

  const event = new CustomEvent('sboWindowClose', {
    detail: {
      windowId: windowId,
      window: windowElement
    },
    cancelable: true
  });

  const shouldClose = document.dispatchEvent(event);

  if (shouldClose) {
    windowElement.remove();
    console.log(`Window closed: ${windowId}`);
  }
}

function createSBOFormWindow(options = {}) {
  const {
    uniqueId = 'formWindow_' + Date.now(),
    title = 'Form',
    width = '800px',
    height = '600px',
    formContent = '',
    showFormButtons = true,
    onAdd = null,
    onUpdate = null,
    onCancel = null
  } = options;

  let footerButtons = '';
  if (showFormButtons) {
    footerButtons = `
      <div class="sbo-form-buttons">
        <div class="sbo-form-buttons__left">
          ${createSBOAddButton({
            uniqueId: `${uniqueId}_btnAdd`,
            onClick: onAdd || `handleFormAdd('${uniqueId}')`
          })}
          ${createSBOUpdateButton({
            uniqueId: `${uniqueId}_btnUpdate`,
            onClick: onUpdate || `handleFormUpdate('${uniqueId}')`
          })}
        </div>
        <div class="sbo-form-buttons__right">
          ${createSBOCancelButton({
            uniqueId: `${uniqueId}_btnCancel`,
            onClick: onCancel || `handleWindowClose('${uniqueId}')`
          })}
        </div>
      </div>
    `;
  }

  return createSBOWindow({
    ...options,
    uniqueId,
    title,
    width,
    height,
    content: formContent,
    footer: footerButtons
  });
}

function handleFormAdd(formWindowId) {
  const event = new CustomEvent('sboFormAdd', {
    detail: {
      formWindowId: formWindowId,
      formWindow: document.getElementById(formWindowId)
    }
  });
  document.dispatchEvent(event);

  console.log(`Form Add clicked: ${formWindowId}`);
}

function handleFormUpdate(formWindowId) {
  const event = new CustomEvent('sboFormUpdate', {
    detail: {
      formWindowId: formWindowId,
      formWindow: document.getElementById(formWindowId)
    }
  });
  document.dispatchEvent(event);

  console.log(`Form Update clicked: ${formWindowId}`);
}

// =============================================================================
// DATA SOURCE (VERİ KAYNAKLARI) BİLEŞENLERİ
// =============================================================================

/**
 * DB Data Source - SAP B1 veritabanı tablolarına doğrudan bağlantı
 * @param {Object} options - Yapılandırma seçenekleri
 * @param {string} options.uniqueId - Benzersiz ID
 * @param {string} options.tableName - SAP B1 tablo adı (örn: OCRD, OITM, OINV)
 * @returns {string} HTML string
 */
function createSBODBDataSource(options = {}) {
  const {
    uniqueId = 'dbds_' + Date.now(),
    tableName = ''
  } = options;

  return `
    <div id="${uniqueId}"
         class="sbo-datasource sbo-dbdatasource"
         data-type="DBDataSource"
         data-table-name="${tableName}">
      <div class="sbo-datasource__header">
        <span class="sbo-datasource__icon">🗄️</span>
        <span class="sbo-datasource__title">DB Data Source</span>
      </div>
      <div class="sbo-datasource__body">
        <div class="sbo-datasource__property">
          <label>UniqueID:</label>
          <input type="text" value="${uniqueId}" readonly class="sbo-datasource__input">
        </div>
        <div class="sbo-datasource__property">
          <label>TableName:</label>
          <input type="text"
                 value="${tableName}"
                 placeholder="e.g., OCRD, OITM, OINV"
                 onchange="updateDBDataSourceTable('${uniqueId}', this.value)"
                 class="sbo-datasource__input">
        </div>
        <div class="sbo-datasource__info">
          <small>Connects form to SAP B1 database table</small>
        </div>
      </div>
    </div>
  `;
}

/**
 * User Data Source - Form üzerinde geçici veri tutma
 * @param {Object} options - Yapılandırma seçenekleri
 * @param {string} options.uniqueId - Benzersiz ID
 * @param {string} options.dataType - Veri tipi (Text, Number, Date)
 * @param {number} options.size - Veri boyutu
 * @returns {string} HTML string
 */
function createSBOUserDataSource(options = {}) {
  const {
    uniqueId = 'uds_' + Date.now(),
    dataType = 'Text',
    size = 50
  } = options;

  return `
    <div id="${uniqueId}"
         class="sbo-datasource sbo-userdatasource"
         data-type="UserDataSource"
         data-data-type="${dataType}"
         data-size="${size}">
      <div class="sbo-datasource__header">
        <span class="sbo-datasource__icon">👤</span>
        <span class="sbo-datasource__title">User Data Source</span>
      </div>
      <div class="sbo-datasource__body">
        <div class="sbo-datasource__property">
          <label>UniqueID:</label>
          <input type="text" value="${uniqueId}" readonly class="sbo-datasource__input">
        </div>
        <div class="sbo-datasource__property">
          <label>DataType:</label>
          <select onchange="updateUserDataSourceType('${uniqueId}', this.value)" class="sbo-datasource__input">
            <option value="Text" ${dataType === 'Text' ? 'selected' : ''}>Text</option>
            <option value="Number" ${dataType === 'Number' ? 'selected' : ''}>Number</option>
            <option value="Date" ${dataType === 'Date' ? 'selected' : ''}>Date</option>
          </select>
        </div>
        <div class="sbo-datasource__property">
          <label>Size:</label>
          <input type="number"
                 value="${size}"
                 onchange="updateUserDataSourceSize('${uniqueId}', this.value)"
                 class="sbo-datasource__input">
        </div>
        <div class="sbo-datasource__info">
          <small>Temporary data storage for calculations</small>
        </div>
      </div>
    </div>
  `;
}

/**
 * Data Tables - Tablo yapısında geçici veri tutma
 * @param {Object} options - Yapılandırma seçenekleri
 * @param {string} options.uniqueId - Benzersiz ID
 * @param {string} options.tableType - Tablo tipi (Manual, Query)
 * @returns {string} HTML string
 */
function createSBODataTable(options = {}) {
  const {
    uniqueId = 'dt_' + Date.now(),
    tableType = 'Manual'
  } = options;

  return `
    <div id="${uniqueId}"
         class="sbo-datasource sbo-datatable"
         data-type="DataTable"
         data-table-type="${tableType}">
      <div class="sbo-datasource__header">
        <span class="sbo-datasource__icon">📊</span>
        <span class="sbo-datasource__title">Data Table</span>
      </div>
      <div class="sbo-datasource__body">
        <div class="sbo-datasource__property">
          <label>UniqueID:</label>
          <input type="text" value="${uniqueId}" readonly class="sbo-datasource__input">
        </div>
        <div class="sbo-datasource__property">
          <label>Type:</label>
          <select onchange="updateDataTableType('${uniqueId}', this.value)" class="sbo-datasource__input">
            <option value="Manual" ${tableType === 'Manual' ? 'selected' : ''}>Manual</option>
            <option value="Query" ${tableType === 'Query' ? 'selected' : ''}>Query</option>
          </select>
        </div>
        <div class="sbo-datasource__info">
          <small>Data source for Grid and Matrix controls</small>
        </div>
      </div>
    </div>
  `;
}

/**
 * Choose From List - SAP B1 standart arama pencereleri
 * @param {Object} options - Yapılandırma seçenekleri
 * @param {string} options.uniqueId - Benzersiz ID
 * @param {string} options.objectType - Nesne tipi (2=Business Partner, 4=Item)
 * @param {boolean} options.multiSelection - Çoklu seçim
 * @returns {string} HTML string
 */
function createSBOChooseFromList(options = {}) {
  const {
    uniqueId = 'cfl_' + Date.now(),
    objectType = '2',
    multiSelection = false
  } = options;

  const objectTypes = {
    '2': 'Business Partners',
    '4': 'Items',
    '17': 'Sales Orders',
    '13': 'Invoices',
    '30': 'Warehouses',
    '1': 'Chart of Accounts'
  };

  return `
    <div id="${uniqueId}"
         class="sbo-datasource sbo-choosefromlist"
         data-type="ChooseFromList"
         data-object-type="${objectType}"
         data-multi-selection="${multiSelection}">
      <div class="sbo-datasource__header">
        <span class="sbo-datasource__icon">🔍</span>
        <span class="sbo-datasource__title">Choose From List</span>
      </div>
      <div class="sbo-datasource__body">
        <div class="sbo-datasource__property">
          <label>UniqueID:</label>
          <input type="text" value="${uniqueId}" readonly class="sbo-datasource__input">
        </div>
        <div class="sbo-datasource__property">
          <label>ObjectType:</label>
          <select onchange="updateChooseFromListType('${uniqueId}', this.value)" class="sbo-datasource__input">
            ${Object.entries(objectTypes).map(([key, value]) =>
              `<option value="${key}" ${objectType === key ? 'selected' : ''}>${key} - ${value}</option>`
            ).join('')}
          </select>
        </div>
        <div class="sbo-datasource__property">
          <label>
            <input type="checkbox"
                   ${multiSelection ? 'checked' : ''}
                   onchange="updateChooseFromListMulti('${uniqueId}', this.checked)">
            Multi Selection
          </label>
        </div>
        <div class="sbo-datasource__info">
          <small>SAP B1 standard search window</small>
        </div>
      </div>
    </div>
  `;
}

// Update fonksiyonları
function updateDBDataSourceTable(id, tableName) {
  const element = document.getElementById(id);
  if (element) {
    element.setAttribute('data-table-name', tableName);
    console.log(`DB Data Source ${id} table updated: ${tableName}`);
  }
}

function updateUserDataSourceType(id, dataType) {
  const element = document.getElementById(id);
  if (element) {
    element.setAttribute('data-data-type', dataType);
    console.log(`User Data Source ${id} type updated: ${dataType}`);
  }
}

function updateUserDataSourceSize(id, size) {
  const element = document.getElementById(id);
  if (element) {
    element.setAttribute('data-size', size);
    console.log(`User Data Source ${id} size updated: ${size}`);
  }
}

function updateDataTableType(id, tableType) {
  const element = document.getElementById(id);
  if (element) {
    element.setAttribute('data-table-type', tableType);
    console.log(`Data Table ${id} type updated: ${tableType}`);
  }
}

function updateChooseFromListType(id, objectType) {
  const element = document.getElementById(id);
  if (element) {
    element.setAttribute('data-object-type', objectType);
    console.log(`Choose From List ${id} object type updated: ${objectType}`);
  }
}

function updateChooseFromListMulti(id, multiSelection) {
  const element = document.getElementById(id);
  if (element) {
    element.setAttribute('data-multi-selection', multiSelection);
    console.log(`Choose From List ${id} multi selection updated: ${multiSelection}`);
  }
}

// =============================================================================
// EDIT MODE (TASARIM DÜZENLEME MODU)
// =============================================================================

/**
 * Edit Mode Manager - Tasarımı düzenlemek için görsel mod
 */
const SBOEditMode = {
  isActive: false,
  selectedElement: null,
  gridSize: 1, // Hareket adım boyutu (piksel)
  snapToGrid: false,
  positionData: {},

  /**
   * Edit modunu başlat
   */
  init: function() {
    this.createToggleButton();
    this.createGridOverlay();
    this.setupKeyboardListeners();
  },

  /**
   * Edit modu toggle butonu oluştur
   */
  createToggleButton: function() {
    if (document.getElementById('sbo-edit-toggle-btn')) return;

    const button = document.createElement('button');
    button.id = 'sbo-edit-toggle-btn';
    button.className = 'sbo-edit-toggle-btn';
    button.textContent = '✏️ Edit Mode';
    button.onclick = () => this.toggle();
    document.body.appendChild(button);
  },

  /**
   * Izgara kılavuz çizgilerini oluştur
   */
  createGridOverlay: function() {
    if (document.getElementById('sbo-grid-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'sbo-grid-overlay';
    overlay.className = 'sbo-grid-overlay';
    document.body.appendChild(overlay);
  },

  /**
   * Edit modunu aç/kapat
   */
  toggle: function() {
    this.isActive = !this.isActive;

    if (this.isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
  },

  /**
   * Edit modunu aktif et
   */
  activate: function() {
    document.body.classList.add('sbo-edit-mode-active');
    const toggleBtn = document.getElementById('sbo-edit-toggle-btn');
    if (toggleBtn) {
      toggleBtn.classList.add('sbo-edit-toggle-btn--active');
      toggleBtn.textContent = '✅ Edit Mode: ON';
    }

    this.createControlPanel();
    this.makeElementsEditable();

    console.log('Edit Mode: ACTIVE');
  },

  /**
   * Edit modunu deaktif et
   */
  deactivate: function() {
    document.body.classList.remove('sbo-edit-mode-active');
    const toggleBtn = document.getElementById('sbo-edit-toggle-btn');
    if (toggleBtn) {
      toggleBtn.classList.remove('sbo-edit-toggle-btn--active');
      toggleBtn.textContent = '✏️ Edit Mode';
    }

    this.removeControlPanel();
    this.removeEditableHandlers();
    this.deselectElement();

    console.log('Edit Mode: INACTIVE');
  },

  /**
   * Kontrol paneli oluştur
   */
  createControlPanel: function() {
    if (document.getElementById('sbo-edit-mode-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'sbo-edit-mode-panel';
    panel.className = 'sbo-edit-mode-panel';
    panel.innerHTML = `
      <div class="sbo-edit-mode-panel__header">
        <span class="sbo-edit-mode-panel__title">🎨 Tasarım Düzenleme</span>
        <button class="sbo-edit-mode-panel__close" onclick="SBOEditMode.toggle()">✕</button>
      </div>
      <div class="sbo-edit-mode-panel__body">
        <div class="sbo-edit-mode-panel__status sbo-edit-mode-panel__status--active">
          ✓ Edit Modu Aktif
        </div>
        <div class="sbo-edit-mode-panel__info">
          <strong>Kullanım:</strong><br>
          • Bir bileşene tıklayın<br>
          • Ok tuşları ile hareket ettirin<br>
          • Shift + Ok = Hızlı hareket<br>
          • Ctrl + S = Kaydet<br>
          • ESC = Seçimi kaldır
        </div>
        <div class="sbo-edit-mode-panel__controls">
          ${createSBOButton({
            uniqueId: 'btnSaveLayout',
            caption: '💾 Tasarımı Kaydet',
            isPrimary: true,
            onClick: 'SBOEditMode.saveLayout()',
            width: '100%'
          })}
          ${createSBOButton({
            uniqueId: 'btnResetPositions',
            caption: '🔄 Konumları Sıfırla',
            onClick: 'SBOEditMode.resetPositions()',
            width: '100%'
          })}
          ${createSBOButton({
            uniqueId: 'btnExportHTML',
            caption: '📄 HTML İndir',
            onClick: 'SBOEditMode.exportHTML()',
            width: '100%'
          })}
        </div>
      </div>
    `;

    document.body.appendChild(panel);
  },

  /**
   * Kontrol panelini kaldır
   */
  removeControlPanel: function() {
    const panel = document.getElementById('sbo-edit-mode-panel');
    if (panel) panel.remove();
  },

  /**
   * Tüm bileşenleri düzenlenebilir yap
   */
  makeElementsEditable: function() {
    // Tüm SAP bileşenlerini düzenlenebilir yap
    const selectors = [
      '.sbo-static-text',
      '.sbo-edit-text',
      '.sbo-linked-button',
      '.sbo-button',
      '.sbo-checkbox',
      '.sbo-combobox',
      '.sbo-extended-edittext',
      '.sbo-option-button',
      '.form-row',
      '.sbo-field-group',
      '.sbo-input-group'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (!el.classList.contains('sbo-edit-mode-panel') &&
            !el.closest('.sbo-edit-mode-panel') &&
            !el.id.startsWith('btn')) {

          el.classList.add('sbo-editable');
          el.style.position = 'relative';

          // Store original position
          const rect = el.getBoundingClientRect();
          const parentRect = el.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

          if (!el.dataset.originalLeft) {
            el.dataset.originalLeft = (rect.left - parentRect.left).toString();
            el.dataset.originalTop = (rect.top - parentRect.top).toString();
          }

          // Click handler
          el.addEventListener('click', (e) => this.handleElementClick(e, el));
        }
      });
    });
  },

  /**
   * Düzenleme işleyicilerini kaldır
   */
  removeEditableHandlers: function() {
    const editables = document.querySelectorAll('.sbo-editable');
    editables.forEach(el => {
      el.classList.remove('sbo-editable', 'sbo-selected');
      el.style.position = '';
      el.style.left = '';
      el.style.top = '';
    });
  },

  /**
   * Bileşen tıklama işleyicisi
   */
  handleElementClick: function(e, element) {
    if (!this.isActive) return;

    e.stopPropagation();
    this.selectElement(element);
  },

  /**
   * Bir bileşeni seç
   */
  selectElement: function(element) {
    // Önceki seçimi kaldır
    this.deselectElement();

    // Yeni elementi seç
    this.selectedElement = element;
    element.classList.add('sbo-selected');

    // Pozisyon göstergesini ekle
    this.showPositionIndicator(element);

    console.log('Element selected:', element);
  },

  /**
   * Seçimi kaldır
   */
  deselectElement: function() {
    if (this.selectedElement) {
      this.selectedElement.classList.remove('sbo-selected');
      this.hidePositionIndicator();
      this.selectedElement = null;
    }
  },

  /**
   * Pozisyon göstergesini göster
   */
  showPositionIndicator: function(element) {
    this.hidePositionIndicator();

    const indicator = document.createElement('div');
    indicator.id = 'sbo-position-indicator';
    indicator.className = 'sbo-position-indicator';
    element.appendChild(indicator);

    this.updatePositionIndicator();
  },

  /**
   * Pozisyon göstergesini güncelle
   */
  updatePositionIndicator: function() {
    const indicator = document.getElementById('sbo-position-indicator');
    if (!indicator || !this.selectedElement) return;

    const left = parseInt(this.selectedElement.style.left) || 0;
    const top = parseInt(this.selectedElement.style.top) || 0;

    indicator.textContent = `X: ${left}px, Y: ${top}px`;
  },

  /**
   * Pozisyon göstergesini gizle
   */
  hidePositionIndicator: function() {
    const indicator = document.getElementById('sbo-position-indicator');
    if (indicator) indicator.remove();
  },

  /**
   * Klavye dinleyicilerini ayarla
   */
  setupKeyboardListeners: function() {
    document.addEventListener('keydown', (e) => {
      if (!this.isActive || !this.selectedElement) return;

      // ESC - Seçimi kaldır
      if (e.key === 'Escape') {
        this.deselectElement();
        return;
      }

      // Ctrl+S - Kaydet
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.saveLayout();
        return;
      }

      // Ok tuşları - Hareket ettir
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();

        const step = e.shiftKey ? 10 : this.gridSize; // Shift ile hızlı hareket
        this.moveElement(e.key, step);
      }
    });
  },

  /**
   * Elementi hareket ettir
   */
  moveElement: function(direction, step) {
    if (!this.selectedElement) return;

    const el = this.selectedElement;
    const currentLeft = parseInt(el.style.left) || 0;
    const currentTop = parseInt(el.style.top) || 0;

    let newLeft = currentLeft;
    let newTop = currentTop;

    switch(direction) {
      case 'ArrowLeft':
        newLeft = currentLeft - step;
        break;
      case 'ArrowRight':
        newLeft = currentLeft + step;
        break;
      case 'ArrowUp':
        newTop = currentTop - step;
        break;
      case 'ArrowDown':
        newTop = currentTop + step;
        break;
    }

    el.style.left = `${newLeft}px`;
    el.style.top = `${newTop}px`;

    this.updatePositionIndicator();

    // Pozisyon verilerini sakla
    this.positionData[el.id || this.generateElementId(el)] = {
      left: newLeft,
      top: newTop
    };
  },

  /**
   * Element için ID oluştur
   */
  generateElementId: function(element) {
    if (element.id) return element.id;

    const id = 'editable_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    element.id = id;
    return id;
  },

  /**
   * Tasarımı kaydet
   */
  saveLayout: function() {
    const layoutData = {
      timestamp: new Date().toISOString(),
      positions: {}
    };

    // Tüm düzenlenmiş elementleri topla
    const editables = document.querySelectorAll('.sbo-editable');
    editables.forEach(el => {
      if (el.style.left || el.style.top) {
        const id = this.generateElementId(el);
        layoutData.positions[id] = {
          left: el.style.left,
          top: el.style.top,
          tag: el.tagName,
          class: el.className
        };
      }
    });

    // LocalStorage'a kaydet
    localStorage.setItem('sbo-layout-data', JSON.stringify(layoutData));

    // Konsola yazdır
    console.log('Layout saved:', layoutData);

    // Kullanıcıya bilgi ver
    alert('✅ Tasarım kaydedildi!\n\n' +
          Object.keys(layoutData.positions).length + ' bileşenin konumu saklandı.\n\n' +
          'Veriler tarayıcı belleğinde (localStorage) saklanmıştır.');

    // Event dispatch et
    const event = new CustomEvent('sboLayoutSaved', {
      detail: layoutData
    });
    document.dispatchEvent(event);
  },

  /**
   * Kaydedilen tasarımı yükle
   */
  loadLayout: function() {
    const savedData = localStorage.getItem('sbo-layout-data');
    if (!savedData) {
      console.log('No saved layout found');
      return;
    }

    try {
      const layoutData = JSON.parse(savedData);

      Object.entries(layoutData.positions).forEach(([id, data]) => {
        const element = document.getElementById(id);
        if (element) {
          element.style.position = 'relative';
          element.style.left = data.left;
          element.style.top = data.top;
        }
      });

      console.log('Layout loaded:', layoutData);
      alert('✅ Kaydedilen tasarım yüklendi!');
    } catch (error) {
      console.error('Error loading layout:', error);
      alert('❌ Tasarım yüklenirken hata oluştu!');
    }
  },

  /**
   * Konumları sıfırla
   */
  resetPositions: function() {
    if (!confirm('Tüm konumları sıfırlamak istediğinizden emin misiniz?')) {
      return;
    }

    const editables = document.querySelectorAll('.sbo-editable');
    editables.forEach(el => {
      el.style.left = '';
      el.style.top = '';
    });

    this.positionData = {};
    localStorage.removeItem('sbo-layout-data');

    console.log('Positions reset');
    alert('✅ Tüm konumlar sıfırlandı!');
  },

  /**
   * HTML'i export et
   */
  exportHTML: function() {
    // Mevcut sayfanın HTML'ini al
    const htmlContent = document.documentElement.outerHTML;

    // İnline style'ları ekle
    const styledHTML = this.inlineStyles(htmlContent);

    // Blob oluştur ve indir
    const blob = new Blob([styledHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `sap-design-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('HTML exported');
    alert('✅ HTML dosyası indirildi!');
  },

  /**
   * Inline style'lar ekle
   */
  inlineStyles: function(html) {
    // Bu fonksiyon HTML'e inline style'ları ekler
    // Basit bir implementasyon - geliştirilebilir
    return html;
  }
};

// Sayfa yüklendiğinde Edit Mode'u başlat
document.addEventListener('DOMContentLoaded', function() {
  SBOEditMode.init();

  // Kaydedilmiş tasarım varsa yükle
  if (localStorage.getItem('sbo-layout-data')) {
    const autoLoad = confirm('Kaydedilmiş bir tasarım bulundu. Yüklemek ister misiniz?');
    if (autoLoad) {
      SBOEditMode.loadLayout();
    }
  }
});