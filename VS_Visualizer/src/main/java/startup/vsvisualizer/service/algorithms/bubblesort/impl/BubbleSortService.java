package startup.vsvisualizer.service.algorithms.bubblesort.impl;

import org.springframework.stereotype.Service;
import startup.vsvisualizer.entity.visualization.VisualizationStep;
import startup.vsvisualizer.service.algorithms.AlgorithmService;

import java.util.ArrayList;
import java.util.List;

@Service
public class BubbleSortService implements AlgorithmService {

    // Helper to format numbers: integers show as "5", decimals show as "3.5" (no trailing zeros)
    private String formatNumber(double value) {
        if (value == Math.floor(value) && !Double.isInfinite(value)) {
            return String.format("%.0f", value);
        } else {
            String formatted = String.format("%.5f", value);
            // Remove trailing zeros
            formatted = formatted.replaceAll("0*$", "");
            // Remove trailing decimal point if present
            if (formatted.endsWith(".")) {
                formatted = formatted.substring(0, formatted.length() - 1);
            }
            return formatted;
        }
    }

    @Override
    public List<VisualizationStep> generateSteps(List<Double> input) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = new ArrayList<>(input);
        int n = array.size();
        int stepNumber = 1;

        // Bubble sort algorithm with step generation
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                // Step: Comparison
                VisualizationStep comparisonStep = new VisualizationStep();
                comparisonStep.setStepNumber(stepNumber++);
                comparisonStep.setDescription(
                    String.format("Comparing %s and %s at positions %d and %d", 
                    formatNumber(array.get(j)), formatNumber(array.get(j + 1)), j, j + 1)
                );
                comparisonStep.setHighlightedIndices(List.of(j, j + 1));
                comparisonStep.setSwappedIndices(new ArrayList<Integer>());
                comparisonStep.setCurrentArray(new ArrayList<Double>(array));
                comparisonStep.setCodeLineNumber(4); // if arr[j] > arr[j+1]
                steps.add(comparisonStep);

                // Check if swap is needed
                if (array.get(j) > array.get(j + 1)) {
                    // Perform swap
                    double temp = array.get(j);
                    array.set(j, array.get(j + 1));
                    array.set(j + 1, temp);

                    // Step: Swap
                    VisualizationStep swapStep = new VisualizationStep();
                    swapStep.setStepNumber(stepNumber++);
                    swapStep.setDescription(
                        String.format("Swapping %s and %s because %s > %s", 
                        formatNumber(array.get(j + 1)), formatNumber(array.get(j)), 
                        formatNumber(array.get(j + 1)), formatNumber(array.get(j)))
                    );
                    swapStep.setHighlightedIndices(List.of(j, j + 1));
                    swapStep.setSwappedIndices(List.of(j, j + 1));
                    swapStep.setCurrentArray(new ArrayList<Double>(array));
                    swapStep.setCodeLineNumber(6); // swap logic
                    steps.add(swapStep);
                }
            }

            // Step: Mark element as sorted
            VisualizationStep sortedStep = new VisualizationStep();
            sortedStep.setStepNumber(stepNumber++);
            sortedStep.setDescription(
                String.format("Element %s is now in its correct sorted position at index %d", 
                formatNumber(array.get(n - i - 1)), n - i - 1)
            );
            sortedStep.setHighlightedIndices(new ArrayList<Integer>());
            sortedStep.setSwappedIndices(new ArrayList<Integer>());
            sortedStep.setCurrentArray(new ArrayList<Double>(array));
            sortedStep.setCodeLineNumber(9); // element in sorted position
            steps.add(sortedStep);
        }

        // Final step: All elements sorted
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Array is now fully sorted!");
        finalStep.setHighlightedIndices(new ArrayList<Integer>());
        finalStep.setSwappedIndices(new ArrayList<Integer>());
        finalStep.setCurrentArray(new ArrayList<Double>(array));
        finalStep.setCodeLineNumber(11); // sorted
        steps.add(finalStep);

        return steps;
    }
}
