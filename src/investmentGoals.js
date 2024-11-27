function convertToMounthlyReturnRate(yearlyReturnRate) {
    return yearlyReturnRate ** (1/12);

}

function generateReturnsArray(startingAmount = 0, timeHorizon = 0, timePeriod = 'monthly', monthlyContribution = 0, returnRate = 0, returnTimeFrame = 'monthly', ) {
    if (!timeHorizon || !startingAmount) {
        throw new Error("Investimento inicial e prazo devem ser preenchidos com valores positivos");     
    }

    const finalReturnRate = returnTimeFrame === 'monthly' ? 1 + returnRate / 100 : convertToMounthlyReturnRate(1 + returnRate / 100);

    const finalTimeHorizon = timePeriod === 'monthly' ? timeHorizon : timeHorizon * 12;

    const referenceInvestmentObject = {
        investedAmount : startingAmount, 
        interestReturns: 0,
        totalInterstReturns: 0,
        month: 0,
        totalAmount: startingAmount, 
    }

    const returnsArray = [referenceInvestmentObject];
    for (let timeReference = 1; timeReference <= finalTimeHorizon; timeReference++){
        const totalAmount = (returnsArray[timeReference - 1].totalAmount * finalReturnRate)
    }
}