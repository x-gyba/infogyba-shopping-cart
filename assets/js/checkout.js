$(document).ready(function () {
  let currentStep = 1;
  const totalSteps = $(".circle").length;

  // Update the progress bar and active step
  function updateStep() {
    // Update active circles
    $(".circle").removeClass("active").slice(0, currentStep).addClass("active");

    // Calculate the width of the progress bar
    const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;
    $(".indicator").css({
      width: progressWidth + "%",
      backgroundColor: "#4caf50",
    });
  }

  // Next button click
  $("#next").click(function () {
    if (currentStep < totalSteps) {
      currentStep++;
      updateStep();
    }
  });

  // Previous button click
  $("#prev").click(function () {
    if (currentStep > 1) {
      currentStep--;
      updateStep();
    }
  });

  // Initialize
  updateStep();
});
