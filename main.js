import { generateReturnsArray } from "./src/investmentGoals";
import { Chart } from "chart.js/auto";

const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
const form = document.getElementById('investment-form');
const clearFormButton = document.getElementById('clear-form');
//const calculateButton = document.getElementById('calculate-results');
let donutChartReference = {};
let progressionChartReference = {};

function formatcurrency(value) {
    return value.toFixed(0)
}

function renderProgression(evt) {
    evt.preventDefault();
    if (document.querySelector('.error')){ 
        return;
    }

    resetCharts();
        // const startingAmount = Number(form['starting-amount'].value)
    const startingAmount = Number(document.getElementById('starting-amount').value.replace(',', '.'));
    const additionalContribution = Number(document.getElementById('additional-contribution').value.replace(",", "."));
    const timeAmount = Number(document.getElementById('time-amount').value);
    const timeAmountPeriod = document.getElementById('time-amount-period').value;
    const returnRate = Number(document.getElementById('return-rate').value.replace(",", "."));
    const returnRatePeriod = document.getElementById('evaluation-period').value;
    const taxRate = Number(document.getElementById('tax-rate').value.replace(",", "."));

    const returnsArray = generateReturnsArray(startingAmount, timeAmount, timeAmountPeriod, additionalContribution, returnRate, returnRatePeriod);

    const finalInvestmentObject =  returnsArray[returnsArray.length - 1]

    // !!!! linha para atras
donutChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
        labels: ["Total Investido", "Rendimento", "Imposto"],
        datasets: [
            {
                data: [
                formatcurrency(finalInvestmentObject.investedAmount),
                formatcurrency(finalInvestmentObject.totalInterstReturns * (1 - taxRate/100)), 
                formatcurrency(finalInvestmentObject.totalInterstReturns * (taxRate/100)),
                ],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
                borderColor: ['#292F36'],
                hoverOffset: 4,
                },
            ],
        },
    });


progressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
        labels: returnsArray.map(investmentObject => investmentObject.month),
        datasets: [{
            label: 'Total Investido',
            data: returnsArray.map(investmentObject => formatcurrency(investmentObject.investedAmount)),
            backgroundColor: 'rgb(255, 99, 132)',
        }, {
            label: 'Retorno de Investimento',
            data: returnsArray.map(investmentObject => formatcurrency(investmentObject.interestReturns)),
            backgroundColor: 'rgb(54, 162, 235)',
        }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true
        }
      }
    }
  });
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function resetCharts() {
    if(
        !isObjectEmpty(donutChartReference) && 
        !isObjectEmpty(progressionChartReference)
    )   {
        donutChartReference.destroy();
        progressionChartReference.destroy();
    }
}

function clearForm() {
    form['starting-amount'].value = '';
    form['additional-contribution'].value = '';
    form['time-amount'].value = '';
    form['return-rate'].value = '';
    form['tax-rate'].value = '';

    resetCharts();


    const errorInputContainers = document.querySelectorAll('.error')

    for(const errorInputContainer of errorInputContainers) {
        errorInputContainer.classList.remove('error')
        errorInputContainer.parentElement.querySelector('p').remove()
    }
}

//calculateButton.addEventListener('click', renderProgression)
function validateInput(evt) {
    if (evt.target.value == '') {
        return;                 
    }
    
    const {parentElement} = evt.target
    const grandParentElement = evt.target.parentElement.parentElement
    const inputValue = evt.target.value.replace(",",".")

    if (
        !parentElement.classList.contains("error") &&
        isNaN(inputValue) || (Number(inputValue) <= 0 )
    ) {
        // objetivo <p class="text-red-500">insira um valor numérico maior que zero</p>
        const errorTextElement = document.createElement("p");
        errorTextElement.classList.add('text-red-500');
        errorTextElement.innerText = 'insira um valor numérico e maior que zero';

        parentElement.classList.add("error");
        grandParentElement.appendChild(errorTextElement);
    } else if (
        parentElement.classList.contains('error') && 
        !isNaN(inputValue) && 
        Number(inputValue) > 0
    )   {
        parentElement.classList.remove("error");
        grandParentElement.querySelector('p').remove();
    }
}

for (const formElement of form) {
    if(formElement.tagName === "INPUT" && formElement.hasAttribute('name')) {
        formElement.addEventListener('blur', validateInput)
    }
}

//form.addEventListener('submit', renderProgression);

clearFormButton.addEventListener('click', clearForm);


