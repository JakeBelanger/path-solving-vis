// CUSTOM, ACCESSIBLE SELECT
(() => {
  const selectEls = document.querySelectorAll('.select');

  Array.from(selectEls).forEach((selectContainer) => {
    const selectEl = selectContainer.querySelector('select');
    if (!selectEl) return;

    // Hide original select
    selectEl.style.display = 'none';

    // Make the select Container tabbable
    selectContainer.setAttribute('tabindex', '0');
    selectContainer.setAttribute('aria-haspopup', 'listbox');

    const a = document.createElement('div');
    a.className = 'select__selected';
    a.innerHTML = selectEl.options[selectEl.selectedIndex].innerHTML;
    a.setAttribute('aria-label', `unselected listbox`);
    a.setAttribute('aria-live', `polite`);
    selectContainer.append(a);

    const b = document.createElement('div');
    b.className = 'select__options';
    b.setAttribute('role', 'listbox');

    // Remove hidden options
    Array.from(selectEl.children).forEach((o) => {
      if (o.hasAttribute('hidden') || o.hasAttribute('disabled')) o.remove();
    });

    const selectArr = Array.from(selectEl);
    selectArr.forEach((opt, i) => {
      const c = document.createElement('div');
      c.className = 'select__item';
      c.innerHTML = opt.innerHTML;
      c.setAttribute('role', 'option');

      if (i === selectEl.selectedIndex) {
        c.classList.add('select__item--selected');
      }

      c.addEventListener('click', (e) => {
        // Set text
        a.innerHTML = c.innerHTML;
        selectArr.forEach((o, i) => {
          if (o.innerHTML === c.innerHTML) {
            selectEl.selectedIndex = i;
            // remove class from siblings
            Array.from(
              c.parentNode.querySelectorAll('.select__item--selected')
            ).forEach((p) => p.classList.remove('select__item--selected'));
            // add selected to self;
            c.classList.add('select__item--selected');
          }
        });
      });

      b.append(c);
    });

    selectContainer.append(b);

    const handleClick = (e) => {
      e.stopPropagation();
      closeAllSelect(selectContainer);
      // Toggle self
      selectContainer.classList.toggle('select--active');
    };

    const updateFromInput = () => {
      const index = selectEl.selectedIndex;
      a.innerHTML = selectEl.options[index].innerHTML;
      Array.from(b.querySelectorAll('.select__item')).forEach((c, i) => {
        if (i === index) c.classList.add('select__item--selected');
        else c.classList.remove('select__item--selected');
      });
    };

    a.addEventListener('click', handleClick);
    selectContainer.addEventListener('keydown', (e) => {
      let index = selectEl.selectedIndex;
      switch (e.which) {
        case 13:
        case 32:
          handleClick(e);
          break;
        case 38: // UP
          if (--index < 0) index = selectEl.options.length - 1;
          selectEl.selectedIndex = index;
          updateFromInput();
          selectContainer.classList.add('select--active');
          break;
        case 40: // DOWN
          if (++index > selectEl.options.length - 1) index = 0;
          selectEl.selectedIndex = index;
          updateFromInput();
          selectContainer.classList.add('select--active');
          break;
        case 27: // ESC
        case 9: // TAB
          selectContainer.classList.remove('select--active');
          break;
        case 35: // END
          selectEl.selectedIndex = 0;
          updateFromInput();
          selectContainer.classList.add('select--active');
          break;
        case 36: // HOME
          selectEl.selectedIndex = selectEl.options.length - 1;
          updateFromInput();
          selectContainer.classList.add('select--active');
          break;
      }
    });
  });

  const closeAllSelect = (el) => {
    // Close all other select boxes except for the el past as an argument
    Array.from(document.querySelectorAll('.select--active'))
      .filter((o) => o !== el)
      .forEach((o) => o.classList.remove('select--active'));
  };

  document.addEventListener('click', closeAllSelect);
})();
