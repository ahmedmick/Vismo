package startup.vsvisualizer.service.datastructures.array.impl;

import org.springframework.stereotype.Service;
import startup.vsvisualizer.dto.datastructures.array.ArrayOperationRequest;
import startup.vsvisualizer.entity.visualization.VisualizationStep;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ArrayDataStructureService {

    public List<VisualizationStep> accessByIndex(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = new ArrayList<>(request.getArray());
        int targetIndex = request.getIndex().intValue();
        int stepNumber = 1;

        // Generate base address (simulate)
        String baseAddress = request.getBaseAddress();
        if (baseAddress == null || baseAddress.isEmpty()) {
            baseAddress = "0x1A4F0000"; // fallback
        }
        int baseNum = (int) Long.parseLong(baseAddress.replace("0x", ""), 16);


        String dataType = request.getSelectedType();
        if (dataType == null) dataType = "int";

        int bytes;
        String typeLabel;
        switch (dataType) {
            case "char":
                bytes = 1;
                typeLabel = "char (1 byte)";
                break;
            case "float":
                bytes = 8;
                typeLabel = "float (8 bytes)";
                break;
            default:
                bytes = 4;
                typeLabel = "int (4 bytes)";
        }

        int offset = targetIndex * bytes;
        String result = "0x" + Integer.toHexString(baseNum + offset).toUpperCase();

        // Step 1: Accessing index
        VisualizationStep step1 = new VisualizationStep();
        step1.setStepNumber(stepNumber++);
        step1.setDescription(String.format("Accessing index [%d] in array of [%d] elements", targetIndex, array.size()));
        step1.setHighlightedIndices(new ArrayList<Integer>());
        step1.setSwappedIndices(new ArrayList<Integer>());
        step1.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step1);

        // Step 2: Formula
        VisualizationStep step2 = new VisualizationStep();
        step2.setStepNumber(stepNumber++);
        step2.setDescription("Formula: address = base_address + (index × bytes)");
        step2.setHighlightedIndices(new ArrayList<Integer>());
        step2.setSwappedIndices(new ArrayList<Integer>());
        step2.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step2);

        // Step 3: Base address and index
        VisualizationStep step3 = new VisualizationStep();
        step3.setStepNumber(stepNumber++);
        step3.setDescription(String.format("Base address: %s, \nIndex: %d", baseAddress, targetIndex));
        step3.setHighlightedIndices(new ArrayList<Integer>());
        step3.setSwappedIndices(new ArrayList<Integer>());
        step3.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step3);

        // Step 4: Calculation
        VisualizationStep step4 = new VisualizationStep();
        step4.setStepNumber(stepNumber++);
        step4.setDescription(String.format("%s\n%s + (%d × %d) = %s", typeLabel, baseAddress, targetIndex, bytes, result));
        step4.setHighlightedIndices(Arrays.asList(targetIndex));
        step4.setSwappedIndices(new ArrayList<Integer>());
        step4.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step4);

        // Step 5: Final result
        VisualizationStep step5 = new VisualizationStep();
        step5.setStepNumber(stepNumber);
        step5.setDescription(String.format("✓ Direct access! O(1) complexity.\nNo scanning needed.\nFound value: %.0f", array.get(targetIndex)));
        step5.setHighlightedIndices(Arrays.asList(targetIndex));
        step5.setSwappedIndices(new ArrayList<Integer>());
        step5.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step5);

        return steps;
    }

    public List<VisualizationStep> updateAtPosition(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = new ArrayList<>(request.getArray());
        int index = request.getIndex().intValue();
        double value = request.getValue();
        int stepNumber = 1;

        // Step 1: Show current array state
        double oldValue = array.get(index);
        VisualizationStep step1 = new VisualizationStep();
        step1.setStepNumber(stepNumber++);
        step1.setDescription(String.format("Current value at index %d is %.0f", index, oldValue));
        step1.setHighlightedIndices(Arrays.asList(index));
        step1.setCurrentArray(new ArrayList<>(array));
        steps.add(step1);

        // Step 2: Show the update operation
        VisualizationStep step2 = new VisualizationStep();
        step2.setStepNumber(stepNumber++);
        step2.setDescription(String.format("Updating index %d: %.0f → %.0f", index, oldValue, value));
        step2.setHighlightedIndices(Arrays.asList(index));
        step2.setCurrentArray(new ArrayList<>(array));
        steps.add(step2);

        // Step 3: Apply the update
        array.set(index, value);
        VisualizationStep step3 = new VisualizationStep();
        step3.setStepNumber(stepNumber);
        step3.setDescription(String.format("Update complete! Index %d now holds %.0f. This is O(1) - direct access.", index, value));
        step3.setHighlightedIndices(Arrays.asList(index));
        step3.setCurrentArray(new ArrayList<>(array));
        steps.add(step3);

        return steps;
    }

    public List<VisualizationStep> insertAtPosition(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = new ArrayList<>(request.getArray());
        int index = request.getIndex().intValue();
        double value = request.getValue();
        int stepNumber = 1;

        // Step 1: Explain why insert is expensive
        VisualizationStep step1 = new VisualizationStep();
        step1.setStepNumber(stepNumber++);
        step1.setDescription(String.format("Insert is O(n) - must shift all elements after insertion point to make room. Arrays are contiguous memory!", value, index));
        step1.setHighlightedIndices(new ArrayList<Integer>());
        step1.setSwappedIndices(new ArrayList<Integer>());
        step1.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step1);

        // Step 2: Highlight insertion point
        VisualizationStep step2 = new VisualizationStep();
        step2.setStepNumber(stepNumber++);
        step2.setDescription(String.format("Inserting %.0f at index %d. Elements from index %d onward must shift right.", value, index, index));
        step2.setHighlightedIndices(Arrays.asList(index));
        step2.setSwappedIndices(new ArrayList<Integer>());
        step2.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step2);

        // Shift elements right one by one
        array.add(0.0); // Add placeholder at end
        for (int i = array.size() - 1; i > index; i--) {
            array.set(i, array.get(i - 1));
            
            VisualizationStep shiftStep = new VisualizationStep();
            shiftStep.setStepNumber(stepNumber++);
            shiftStep.setDescription(String.format("Shifting element %.0f from index %d to %d (this is expensive!)", array.get(i), i - 1, i));
            shiftStep.setHighlightedIndices(Arrays.asList(i));
            shiftStep.setSwappedIndices(new ArrayList<Integer>());
            shiftStep.setCurrentArray(new ArrayList<Double>(array));
            steps.add(shiftStep);
        }

        // Insert the value
        array.set(index, value);
        
        VisualizationStep insertStep = new VisualizationStep();
        insertStep.setStepNumber(stepNumber);
        insertStep.setDescription(String.format("Inserted %.0f at index %d. All shifting complete!", value, index));
        insertStep.setHighlightedIndices(Arrays.asList(index));
        insertStep.setSwappedIndices(new ArrayList<Integer>());
        insertStep.setCurrentArray(new ArrayList<Double>(array));
        steps.add(insertStep);

        return steps;
    }

    public List<VisualizationStep> deleteAtPosition(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = new ArrayList<>(request.getArray());
        int index = request.getIndex().intValue();
        int stepNumber = 1;

        // Step 1: Explain why delete is expensive
        VisualizationStep step1 = new VisualizationStep();
        step1.setStepNumber(stepNumber++);
        step1.setDescription(String.format("Delete is O(n) - must shift all elements after deletion point to fill the gap. Arrays are contiguous memory!", index));
        step1.setHighlightedIndices(new ArrayList<Integer>());
        step1.setSwappedIndices(new ArrayList<Integer>());
        step1.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step1);

        // Step 2: Highlight element to delete
        VisualizationStep step2 = new VisualizationStep();
        step2.setStepNumber(stepNumber++);
        step2.setDescription(String.format("Deleting element at index %d. Elements from index %d onward must shift left.", index, index + 1));
        step2.setHighlightedIndices(Arrays.asList(index));
        step2.setSwappedIndices(new ArrayList<Integer>());
        step2.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step2);

        // Shift elements left one by one
        for (int i = index; i < array.size() - 1; i++) {
            array.set(i, array.get(i + 1));
            
            VisualizationStep shiftStep = new VisualizationStep();
            shiftStep.setStepNumber(stepNumber++);
            shiftStep.setDescription(String.format("Shifting element %.0f from index %d to %d (this is expensive!)", array.get(i), i + 1, i));
            shiftStep.setHighlightedIndices(Arrays.asList(i));
            shiftStep.setSwappedIndices(new ArrayList<Integer>());
            shiftStep.setCurrentArray(new ArrayList<Double>(array));
            steps.add(shiftStep);
        }

        // Remove last element
        array.remove(array.size() - 1);

        // Final step
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Deleted element. All shifting complete! Array updated.");
        finalStep.setHighlightedIndices(new ArrayList<Integer>());
        finalStep.setSwappedIndices(new ArrayList<Integer>());
        finalStep.setCurrentArray(new ArrayList<Double>(array));
        steps.add(finalStep);

        return steps;
    }

    public List<VisualizationStep> searchForValue(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = new ArrayList<>(request.getArray());
        double targetValue = request.getValue();
        int stepNumber = 1;

        // Step 1: Explain arrays don't have built-in search
        VisualizationStep step1 = new VisualizationStep();
        step1.setStepNumber(stepNumber++);
        step1.setDescription(String.format("Arrays don't have built-in search. Must scan each element O(n). Unlike access, search requires scanning.", targetValue));
        step1.setHighlightedIndices(new ArrayList<Integer>());
        step1.setSwappedIndices(new ArrayList<Integer>());
        step1.setCurrentArray(new ArrayList<Double>(array));
        steps.add(step1);

        // Search through array
        boolean found = false;
        for (int i = 0; i < array.size(); i++) {
            double currentValue = array.get(i);
            boolean match = currentValue == targetValue;
            
            VisualizationStep checkStep = new VisualizationStep();
            checkStep.setStepNumber(stepNumber++);
            checkStep.setDescription(String.format("Checking index %d: %.0f == %.0f? %s", 
                i, currentValue, targetValue, match ? "Yes" : "No"));
            checkStep.setHighlightedIndices(Arrays.asList(i));
            checkStep.setSwappedIndices(new ArrayList<Integer>());
            checkStep.setCurrentArray(new ArrayList<Double>(array));
            steps.add(checkStep);

            if (match) {
                found = true;
                VisualizationStep foundStep = new VisualizationStep();
                foundStep.setStepNumber(stepNumber);
                foundStep.setDescription(String.format("Found %.0f at index %d after scanning!", targetValue, i));
                foundStep.setHighlightedIndices(Arrays.asList(i));
                foundStep.setSwappedIndices(new ArrayList<Integer>());
                foundStep.setCurrentArray(new ArrayList<Double>(array));
                steps.add(foundStep);
                break;
            }
        }

        // If not found
        if (!found) {
            VisualizationStep notFoundStep = new VisualizationStep();
            notFoundStep.setStepNumber(stepNumber);
            notFoundStep.setDescription(String.format("Value %.0f not found in array after scanning all elements", targetValue));
            notFoundStep.setHighlightedIndices(new ArrayList<Integer>());
            notFoundStep.setSwappedIndices(new ArrayList<Integer>());
            notFoundStep.setCurrentArray(new ArrayList<Double>(array));
            steps.add(notFoundStep);
        }

        return steps;
    }

    public List<VisualizationStep> traverseTheArray(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = new ArrayList<>(request.getArray());
        int stepNumber = 1;

        // Step 1: Start traversal
        VisualizationStep startStep = new VisualizationStep();
        startStep.setStepNumber(stepNumber++);
        startStep.setDescription(String.format("Starting traversal of array with %d elements", array.size()));
        startStep.setHighlightedIndices(new ArrayList<>());
        startStep.setCurrentArray(new ArrayList<>(array));
        steps.add(startStep);

        // Step 2: Visit each element
        for (int i = 0; i < array.size(); i++) {
            double currentValue = array.get(i);

            VisualizationStep step = new VisualizationStep();
            step.setStepNumber(stepNumber++);
            step.setDescription(String.format("Visiting index %d: value %.0f", i, currentValue));
            step.setHighlightedIndices(Arrays.asList(i));
            step.setCurrentArray(new ArrayList<>(array));
            steps.add(step);
        }

        // Step 3: Traversal complete
        VisualizationStep endStep = new VisualizationStep();
        endStep.setStepNumber(stepNumber);
        endStep.setDescription(String.format("Traversal complete! Visited all %d elements.", array.size()));
        endStep.setHighlightedIndices(new ArrayList<>());
        endStep.setCurrentArray(new ArrayList<>(array));
        steps.add(endStep);

        return steps;
    }
}
