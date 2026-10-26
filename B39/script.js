
    const addCounterBtn = document.getElementById('addCounterBtn');
    const gridContainer = document.getElementById('gridContainer');

    
    
    function createCounterCard() {
      const card = document.createElement('div');
      card.classList.add('counter-card');

      
      let count = 0;

     
      card.innerHTML = `
        <div class="counter-number">${count}</div>
        <div class="counter-actions">
          <button class="btn-decrease">Decrease</button>
          <button class="btn-increase">Increase</button>
        </div>
      `;

      
      const btnDecrease = card.querySelector('.btn-decrease');
      const btnIncrease = card.querySelector('.btn-increase');
      const numberDisplay = card.querySelector('.counter-number');

      
      btnDecrease.addEventListener('click', () => {
        count--;
        numberDisplay.textContent = count;
      });

      btnIncrease.addEventListener('click', () => {
        count++;
        numberDisplay.textContent = count;
      });

     
      gridContainer.appendChild(card);
    }

   
    addCounterBtn.addEventListener('click', createCounterCard);