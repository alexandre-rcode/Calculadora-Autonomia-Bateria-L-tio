document.addEventListener('DOMContentLoaded', () => {
    // Fator de eficiência/descarga fixa (85%)
    const USABLE_CAPACITY_FACTOR = 0.85; // 100% - 15% = 85%

    const autonomyForm = document.getElementById('autonomy-form');
    const resultArea = document.getElementById('result-area');

    // Inputs
    const capacityInput = document.getElementById('capacity-per-battery');
    const numBatteriesInput = document.getElementById('num-batteries');
    const consumptionInput = document.getElementById('avg-consumption');

    autonomyForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // 1. Limpar resultado anterior e validação
        resultArea.innerHTML = '';
        resultArea.style.display = 'none';

        // 2. Obter e converter os valores
        const capacityPerBattery = parseFloat(capacityInput.value);
        const numBatteries = parseInt(numBatteriesInput.value, 10);
        const averageConsumption = parseFloat(consumptionInput.value);

        // 3. Validação Robusta
        let errorMessage = '';
        let invalidInput = null;

        if (isNaN(capacityPerBattery) || capacityPerBattery <= 0) {
            errorMessage = 'Capacidade nominal por bateria inválida (deve ser > 0).';
            invalidInput = capacityInput;
        } else if (isNaN(numBatteries) || numBatteries <= 0) {
            errorMessage = 'Quantidade de baterias inválida (deve ser >= 1).';
            invalidInput = numBatteriesInput;
        } else if (isNaN(averageConsumption) || averageConsumption < 0) {
            errorMessage = 'Consumo médio inválido (deve ser >= 0).';
            invalidInput = consumptionInput;
        } else if (averageConsumption === 0) {
             errorMessage = 'Com consumo zero (0 A), a autonomia é teoricamente infinita.';
             // Não focamos em nenhum campo específico aqui
        }

        // Se houver erro, exibe e para
        if (errorMessage) {
            resultArea.innerHTML = `<p class="error">${errorMessage}</p>`;
            resultArea.style.display = 'block';
            if (invalidInput) {
                invalidInput.focus(); // Foca no campo inválido
            }
            // Rola a página para a área de resultado/erro ser visível
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // 4. Cálculos com o fator fixo de 85%
        const totalNominalCapacity = capacityPerBattery * numBatteries;
        const usableCapacity = totalNominalCapacity * USABLE_CAPACITY_FACTOR; // Aplica os 85%
        const autonomyHoursDecimal = usableCapacity / averageConsumption;

        // 5. Formatar o resultado em Horas e Minutos
        const totalMinutes = Math.floor(autonomyHoursDecimal * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // 6. Exibir o resultado com clareza sobre a capacidade útil
        resultArea.innerHTML = `
            <p><span class="label">Capacidade Total Nominal:</span> ${totalNominalCapacity.toFixed(1)} Ah</p>
            <p><span class="label">Capacidade Útil (85%):</span> ${usableCapacity.toFixed(1)} Ah</p>
            <hr>
            <p><span class="label">Tempo Estimado de Autonomia:</span></p>
            <p><span class="value">${hours} hora${hours !== 1 ? 's' : ''} e ${minutes} minuto${minutes !== 1 ? 's' : ''}</span></p>
        `;
        resultArea.style.display = 'block'; // Mostra a área de resultado

        // Rola a página para a área de resultado ser visível
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

     // Opcional: Adicionar listeners para limpar o resultado se os inputs mudarem
     [capacityInput, numBatteriesInput, consumptionInput].forEach(input => {
        input.addEventListener('input', () => {
            if (resultArea.style.display !== 'none') {
                 resultArea.style.display = 'none';
                 resultArea.innerHTML = '';
            }
        });
     });

}); // Fim do DOMContentLoaded
