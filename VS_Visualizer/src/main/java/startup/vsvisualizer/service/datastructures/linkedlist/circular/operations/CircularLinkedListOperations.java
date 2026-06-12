package startup.vsvisualizer.service.datastructures.linkedlist.circular.operations;

import org.springframework.stereotype.Component;
import startup.vsvisualizer.dto.datastructures.array.ArrayOperationRequest;
import startup.vsvisualizer.entity.visualization.CustomPointer;
import startup.vsvisualizer.entity.visualization.VisualizationStep;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static startup.vsvisualizer.service.datastructures.linkedlist.common.LinkedListVisualizationSupport.copyArray;
import static startup.vsvisualizer.service.datastructures.linkedlist.common.LinkedListVisualizationSupport.formatValue;

@Component
public class CircularLinkedListOperations {

    public List<VisualizationStep> accessByIndex(List<Double> nodes, int targetIndex) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(nodes);
        int stepNumber = 1;

        if (array.isEmpty() || targetIndex < 0 || targetIndex >= array.size()) {
            return steps;
        }

        VisualizationStep startStep = new VisualizationStep();
        startStep.setStepNumber(stepNumber++);
        startStep.setDescription(String.format("Starting at head node.\nNeed to reach index [%d].", targetIndex));
        startStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
        startStep.setTempPointerIndex(0);
        startStep.setCurrentArray(new ArrayList<>(array));
        steps.add(startStep);

        for (int i = 1; i < targetIndex && i < array.size(); i++) {
            VisualizationStep step = new VisualizationStep();
            step.setStepNumber(stepNumber++);
            step.setDescription(String.format("temp is at index [%d].\nMoving temp to next node.", i));
            step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
            step.setTempPointerIndex(i);
            step.setCurrentArray(new ArrayList<>(array));
            steps.add(step);
        }

        VisualizationStep foundStep = new VisualizationStep();
        foundStep.setStepNumber(stepNumber);
        foundStep.setDescription(String.format("temp reached index [%d].\nFound value: [%s].", targetIndex, formatValue(array.get(targetIndex))));
        foundStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(targetIndex)));
        foundStep.setTempPointerIndex(targetIndex);
        foundStep.setCurrentArray(new ArrayList<>(array));
        steps.add(foundStep);

        return steps;
    }

    public List<VisualizationStep> updateAtPosition(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        int targetIndex = request.getIndex().intValue();
        double value = request.getValue();
        int stepNumber = 1;

        if (array.isEmpty() || targetIndex < 0 || targetIndex >= array.size()) {
            return steps;
        }

        VisualizationStep startStep = new VisualizationStep();
        startStep.setStepNumber(stepNumber++);
        startStep.setDescription(String.format("Starting at head node.\nNeed to reach index [%d] to update it.", targetIndex));
        startStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
        startStep.setTempPointerIndex(0);
        startStep.setCurrentArray(new ArrayList<>(array));
        steps.add(startStep);

        for (int i = 1; i < targetIndex && i < array.size(); i++) {
            VisualizationStep step = new VisualizationStep();
            step.setStepNumber(stepNumber++);
            step.setDescription(String.format("temp is at index [%d].\nMoving temp to next node.", i));
            step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
            step.setTempPointerIndex(i);
            step.setCurrentArray(new ArrayList<>(array));
            steps.add(step);
        }

        double oldValue = array.get(targetIndex);
        VisualizationStep foundStep = new VisualizationStep();
        foundStep.setStepNumber(stepNumber++);
        foundStep.setDescription(String.format("temp reached index [%d].\nCurrent value is: [%s].\nPreparing to update.", targetIndex, formatValue(oldValue)));
        foundStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(targetIndex)));
        foundStep.setTempPointerIndex(targetIndex);
        foundStep.setCurrentArray(new ArrayList<>(array));
        steps.add(foundStep);

        array.set(targetIndex, value);
        VisualizationStep updateStep = new VisualizationStep();
        updateStep.setStepNumber(stepNumber++);
        updateStep.setDescription(String.format("Updating node %d: %s → %s", targetIndex, formatValue(oldValue), formatValue(value)));
        updateStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(targetIndex)));
        updateStep.setTempPointerIndex(targetIndex);
        updateStep.setCurrentArray(new ArrayList<>(array));
        steps.add(updateStep);

        VisualizationStep completeStep = new VisualizationStep();
        completeStep.setStepNumber(stepNumber);
        completeStep.setDescription(String.format("Update complete! Node %d now holds %s.\nO(n) - traversal required.", targetIndex, formatValue(value)));
        completeStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(targetIndex)));
        completeStep.setTempPointerIndex(targetIndex);
        completeStep.setCurrentArray(new ArrayList<>(array));
        steps.add(completeStep);

        return steps;
    }

    public List<VisualizationStep> insertAtHead(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        double value = request.getValue();
        int stepNumber = 1;

        VisualizationStep createStep = new VisualizationStep();
        createStep.setStepNumber(stepNumber++);
        createStep.setDescription(String.format("Creating new node with value %s", formatValue(value)));
        createStep.setHighlightedIndices(new ArrayList<>());
        createStep.setTempPointerIndex(0);
        createStep.setCurrentArray(new ArrayList<>(array));
        createStep.setFloatingNodeValue(value);
        createStep.setFloatingNodeLabel("New Node");
        steps.add(createStep);

        if (!array.isEmpty()) {
            for (int i = 0; i < array.size(); i++) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("Circular: Must find tail. temp at [%d]", i));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                step.setFloatingNodeValue(value);
                step.setFloatingNodeLabel("New Node");
                steps.add(step);
            }

            VisualizationStep wireNext = new VisualizationStep();
            wireNext.setStepNumber(stepNumber++);
            wireNext.setDescription("newNode.next = head");
            wireNext.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
            wireNext.setTempPointerIndex(0);
            wireNext.setCurrentArray(new ArrayList<>(array));
            wireNext.setFloatingNodeValue(value);
            wireNext.setFloatingNodeLabel("New Node");
            wireNext.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer("floating", "0", "next", true)
            )));
            steps.add(wireNext);

            int tailIdx = array.size() - 1;
            VisualizationStep wireTail = new VisualizationStep();
            wireTail.setStepNumber(stepNumber++);
            wireTail.setDescription("tail.next = newNode (circular link)");
            wireTail.setHighlightedIndices(new ArrayList<>(Arrays.asList(tailIdx)));
            wireTail.setTempPointerIndex(tailIdx);
            wireTail.setCurrentArray(new ArrayList<>(array));
            wireTail.setFloatingNodeValue(value);
            wireTail.setFloatingNodeLabel("New Node");
            wireTail.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer("floating", "0", "next", false),
                new CustomPointer(String.valueOf(tailIdx), "floating", "next", true)
            )));
            steps.add(wireTail);
        }

        array.add(0, value);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Node inserted at head!\nO(n) due to finding tail.");
        finalStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
        finalStep.setTempPointerIndex(0);
        finalStep.setCurrentArray(new ArrayList<>(array));
        steps.add(finalStep);

        return steps;
    }

    public List<VisualizationStep> insertAtTail(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        double value = request.getValue();
        int stepNumber = 1;

        VisualizationStep createStep = new VisualizationStep();
        createStep.setStepNumber(stepNumber++);
        createStep.setDescription(String.format("Creating new node with value %.0f", value));
        createStep.setHighlightedIndices(new ArrayList<>());
        createStep.setTempPointerIndex(array.isEmpty() ? 0 : array.size() - 1);
        createStep.setCurrentArray(new ArrayList<>(array));
        createStep.setFloatingNodeValue(value);
        createStep.setFloatingNodeLabel("New Node");
        steps.add(createStep);

        if (!array.isEmpty()) {
            for (int i = 0; i < array.size(); i++) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("At node %d: value %s → moving to next", i, formatValue(array.get(i))));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                step.setFloatingNodeValue(value);
                step.setFloatingNodeLabel("New Node");
                steps.add(step);
            }

            int tailIdx = array.size() - 1;
            VisualizationStep wireNext = new VisualizationStep();
            wireNext.setStepNumber(stepNumber++);
            wireNext.setDescription("tail.next = newNode");
            wireNext.setHighlightedIndices(new ArrayList<>(Arrays.asList(tailIdx)));
            wireNext.setTempPointerIndex(tailIdx);
            wireNext.setCurrentArray(new ArrayList<>(array));
            wireNext.setFloatingNodeValue(value);
            wireNext.setFloatingNodeLabel("New Node");
            wireNext.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer(String.valueOf(tailIdx), "floating", "next", true)
            )));
            steps.add(wireNext);

            VisualizationStep wireCirc = new VisualizationStep();
            wireCirc.setStepNumber(stepNumber++);
            wireCirc.setDescription("newNode.next = head (circular link)");
            wireCirc.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
            wireCirc.setTempPointerIndex(tailIdx);
            wireCirc.setCurrentArray(new ArrayList<>(array));
            wireCirc.setFloatingNodeValue(value);
            wireCirc.setFloatingNodeLabel("New Node");
            wireCirc.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer(String.valueOf(tailIdx), "floating", "next", false),
                new CustomPointer("floating", "head", "next", true)
            )));
            steps.add(wireCirc);
        }

        array.add(value);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Node inserted at tail!\nO(n) - had to traverse all nodes.");
        finalStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(array.size() - 1)));
        finalStep.setTempPointerIndex(array.size() - 1);
        finalStep.setCurrentArray(new ArrayList<>(array));
        steps.add(finalStep);

        return steps;
    }

    public List<VisualizationStep> insertAtPosition(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        int index = request.getIndex().intValue();
        double value = request.getValue();
        int stepNumber = 1;

        if (array.isEmpty() || index < 0 || index > array.size()) {
            return steps;
        }

        VisualizationStep createStep = new VisualizationStep();
        createStep.setStepNumber(stepNumber++);
        createStep.setDescription(String.format("Creating new node with value %.0f", value));
        createStep.setHighlightedIndices(new ArrayList<>());
        createStep.setTempPointerIndex(0);
        createStep.setCurrentArray(new ArrayList<>(array));
        createStep.setFloatingNodeValue(value);
        createStep.setFloatingNodeLabel("New Node");
        steps.add(createStep);

        for (int i = 0; i < index; i++) {
            VisualizationStep step = new VisualizationStep();
            step.setStepNumber(stepNumber++);
            step.setDescription(String.format("At node %d: value %s → moving to next", i, formatValue(array.get(i))));
            step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
            step.setTempPointerIndex(i);
            step.setCurrentArray(new ArrayList<>(array));
            step.setFloatingNodeValue(value);
            step.setFloatingNodeLabel("New Node");
            steps.add(step);
        }

        int prevIdx = index - 1;
        String nextNodeId = index < array.size() ? String.valueOf(index) : "null";

        if (index < array.size()) {
            VisualizationStep wireNext = new VisualizationStep();
            wireNext.setStepNumber(stepNumber++);
            wireNext.setDescription(String.format("newNode.next = node[%d]", index));
            wireNext.setHighlightedIndices(new ArrayList<>(Arrays.asList(index)));
            wireNext.setTempPointerIndex(index);
            wireNext.setCurrentArray(new ArrayList<>(array));
            wireNext.setFloatingNodeValue(value);
            wireNext.setFloatingNodeLabel("New Node");
            wireNext.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer("floating", nextNodeId, "next", true)
            )));
            steps.add(wireNext);
        }

        if (prevIdx >= 0) {
            VisualizationStep wirePrevNext = new VisualizationStep();
            wirePrevNext.setStepNumber(stepNumber++);
            wirePrevNext.setDescription(String.format("node[%d].next = newNode", prevIdx));
            wirePrevNext.setHighlightedIndices(new ArrayList<>(Arrays.asList(prevIdx)));
            wirePrevNext.setTempPointerIndex(index);
            wirePrevNext.setCurrentArray(new ArrayList<>(array));
            wirePrevNext.setFloatingNodeValue(value);
            wirePrevNext.setFloatingNodeLabel("New Node");
            List<CustomPointer> ptrs = new ArrayList<>();
            if (index < array.size()) {
                ptrs.add(new CustomPointer("floating", nextNodeId, "next", false));
            }
            ptrs.add(new CustomPointer(String.valueOf(prevIdx), "floating", "next", true));
            wirePrevNext.setCustomPointers(ptrs);
            steps.add(wirePrevNext);
        }

        array.add(index, value);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription(String.format("Inserted %.0f at position %d.\nO(n) traversal complete.", value, index));
        finalStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(index)));
        finalStep.setTempPointerIndex(index);
        finalStep.setCurrentArray(new ArrayList<>(array));
        steps.add(finalStep);

        return steps;
    }

    public List<VisualizationStep> deleteAtHead(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        int stepNumber = 1;

        if (array.isEmpty()) {
            return steps;
        }

        double deletedValue = array.get(0);

        VisualizationStep identifyStep = new VisualizationStep();
        identifyStep.setStepNumber(stepNumber++);
        identifyStep.setDescription(String.format("Head node has value %s. Marking for deletion.", formatValue(deletedValue)));
        identifyStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
        identifyStep.setTempPointerIndex(0);
        identifyStep.setCurrentArray(new ArrayList<>(array));
        steps.add(identifyStep);

        if (array.size() > 1) {
            for (int i = 0; i < array.size(); i++) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("Circular: Must find tail. temp at [%d]", i));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                steps.add(step);
            }

            VisualizationStep wireHead = new VisualizationStep();
            wireHead.setStepNumber(stepNumber++);
            wireHead.setDescription("head = head.next (moving head pointer to next node)");
            wireHead.setHighlightedIndices(new ArrayList<>(Arrays.asList(0, 1)));
            wireHead.setTempPointerIndex(1);
            wireHead.setCurrentArray(new ArrayList<>(array));
            wireHead.setFloatingNodeValue(deletedValue);
            wireHead.setFloatingNodeLabel("Deleted");
            wireHead.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer("floating", "1", "next", true)
            )));
            steps.add(wireHead);

            int tailIdx = array.size() - 1;
            VisualizationStep wireTail = new VisualizationStep();
            wireTail.setStepNumber(stepNumber++);
            wireTail.setDescription("tail.next = newHead (circular link update)");
            wireTail.setHighlightedIndices(new ArrayList<>(Arrays.asList(tailIdx)));
            wireTail.setTempPointerIndex(tailIdx);
            wireTail.setCurrentArray(new ArrayList<>(array));
            wireTail.setFloatingNodeValue(deletedValue);
            wireTail.setFloatingNodeLabel("Deleted");
            wireTail.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer(String.valueOf(tailIdx), "1", "next", true)
            )));
            steps.add(wireTail);
        }

        array.remove(0);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Head deleted!\nO(n) due to finding tail.");
        finalStep.setHighlightedIndices(new ArrayList<>());
        finalStep.setTempPointerIndex(0);
        finalStep.setCurrentArray(new ArrayList<>(array));
        steps.add(finalStep);

        return steps;
    }

    public List<VisualizationStep> deleteAtTail(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        int stepNumber = 1;

        if (array.isEmpty()) {
            return steps;
        }

        int tailIdx = array.size() - 1;
        double deletedValue = array.get(tailIdx);

        VisualizationStep identifyStep = new VisualizationStep();
        identifyStep.setStepNumber(stepNumber++);
        identifyStep.setDescription(String.format("Tail node has value %s. Marking for deletion.", formatValue(deletedValue)));
        identifyStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(tailIdx)));
        identifyStep.setTempPointerIndex(tailIdx);
        identifyStep.setCurrentArray(new ArrayList<>(array));
        steps.add(identifyStep);

        if (array.size() > 1) {
            for (int i = 0; i < array.size() - 1; i++) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("At node %d: value %s → moving to next", i, formatValue(array.get(i))));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                steps.add(step);
            }

            int prevIdx = tailIdx - 1;
            VisualizationStep wireNext = new VisualizationStep();
            wireNext.setStepNumber(stepNumber++);
            wireNext.setDescription("prevNode.next = head (circular link bypass)");
            wireNext.setHighlightedIndices(new ArrayList<>(Arrays.asList(prevIdx)));
            wireNext.setTempPointerIndex(prevIdx);
            wireNext.setCurrentArray(new ArrayList<>(array));
            wireNext.setFloatingNodeValue(deletedValue);
            wireNext.setFloatingNodeLabel("Deleted");
            wireNext.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer(String.valueOf(prevIdx), "head", "next", true)
            )));
            steps.add(wireNext);
        }

        array.remove(tailIdx);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Tail deleted!\nO(n) - had to traverse to find second-to-last.");
        finalStep.setHighlightedIndices(new ArrayList<>());
        finalStep.setTempPointerIndex(Math.max(0, array.size() - 1));
        finalStep.setCurrentArray(new ArrayList<>(array));
        steps.add(finalStep);

        return steps;
    }

    public List<VisualizationStep> deleteAtPosition(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        int index = request.getIndex().intValue();
        int stepNumber = 1;

        if (array.isEmpty() || index < 0 || index >= array.size()) {
            return steps;
        }

        double deletedValue = array.get(index);

        for (int i = 0; i <= index; i++) {
            VisualizationStep step = new VisualizationStep();
            step.setStepNumber(stepNumber++);
            step.setDescription(String.format("At node %d: value %s", i, formatValue(array.get(i))));
            step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
            step.setTempPointerIndex(i);
            step.setCurrentArray(new ArrayList<>(array));
            steps.add(step);
        }

        VisualizationStep identifyStep = new VisualizationStep();
        identifyStep.setStepNumber(stepNumber++);
        identifyStep.setDescription(String.format("Found node[%d] with value %s. Marking for deletion.", index, formatValue(deletedValue)));
        identifyStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(index)));
        identifyStep.setTempPointerIndex(index);
        identifyStep.setCurrentArray(new ArrayList<>(array));
        steps.add(identifyStep);

        int prevIdx = index - 1;
        int nextIdx = index + 1;

        if (prevIdx >= 0 && nextIdx < array.size()) {
            VisualizationStep wireBypass = new VisualizationStep();
            wireBypass.setStepNumber(stepNumber++);
            wireBypass.setDescription(String.format("node[%d].next = node[%d] (bypass deleted node)", prevIdx, nextIdx));
            wireBypass.setHighlightedIndices(new ArrayList<>(Arrays.asList(prevIdx, nextIdx)));
            wireBypass.setTempPointerIndex(prevIdx);
            wireBypass.setCurrentArray(new ArrayList<>(array));
            wireBypass.setFloatingNodeValue(deletedValue);
            wireBypass.setFloatingNodeLabel("Deleted");
            wireBypass.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer(String.valueOf(prevIdx), String.valueOf(nextIdx), "next", true)
            )));
            steps.add(wireBypass);
        } else if (prevIdx >= 0) {
            VisualizationStep wireNull = new VisualizationStep();
            wireNull.setStepNumber(stepNumber++);
            wireNull.setDescription(String.format("node[%d].next = null", prevIdx));
            wireNull.setHighlightedIndices(new ArrayList<>(Arrays.asList(prevIdx)));
            wireNull.setTempPointerIndex(prevIdx);
            wireNull.setCurrentArray(new ArrayList<>(array));
            wireNull.setFloatingNodeValue(deletedValue);
            wireNull.setFloatingNodeLabel("Deleted");
            steps.add(wireNull);
        }

        array.remove(index);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription(String.format("Node at position %d removed.\nO(n) traversal complete.", index));
        finalStep.setHighlightedIndices(new ArrayList<>());
        finalStep.setTempPointerIndex(Math.max(0, index - 1));
        finalStep.setCurrentArray(new ArrayList<>(array));
        steps.add(finalStep);

        return steps;
    }

    public List<VisualizationStep> searchForValue(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        double targetValue = request.getValue();
        int stepNumber = 1;

        VisualizationStep step1 = new VisualizationStep();
        step1.setStepNumber(stepNumber++);
        step1.setDescription(String.format("Searching for value %.0f...", targetValue));
        step1.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
        step1.setTempPointerIndex(0);
        step1.setCurrentArray(new ArrayList<>(array));
        steps.add(step1);

        boolean found = false;
        for (int i = 0; i < array.size(); i++) {
            double currentValue = array.get(i);
            boolean isMatch = currentValue == targetValue;

            VisualizationStep step = new VisualizationStep();
            step.setStepNumber(stepNumber++);
            step.setDescription(String.format("Checking node %d: %.0f == %.0f? %s", i, currentValue, targetValue, isMatch ? "Yes!" : "No"));
            step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
            step.setTempPointerIndex(i);
            step.setCurrentArray(new ArrayList<>(array));
            steps.add(step);

            if (isMatch) {
                found = true;
                VisualizationStep foundStep = new VisualizationStep();
                foundStep.setStepNumber(stepNumber);
                foundStep.setDescription(String.format("Found %.0f at node %d!", targetValue, i));
                foundStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                foundStep.setTempPointerIndex(i);
                foundStep.setCurrentArray(new ArrayList<>(array));
                steps.add(foundStep);
                break;
            }
        }

        if (!found) {
            VisualizationStep notFoundStep = new VisualizationStep();
            notFoundStep.setStepNumber(stepNumber);
            notFoundStep.setDescription(String.format("Value %.0f not found. Searched all %d nodes.", targetValue, array.size()));
            notFoundStep.setHighlightedIndices(new ArrayList<>());
            notFoundStep.setTempPointerIndex(array.isEmpty() ? 0 : array.size() - 1);
            notFoundStep.setCurrentArray(new ArrayList<>(array));
            steps.add(notFoundStep);
        }

        return steps;
    }

    public List<VisualizationStep> traverseTheArray(ArrayOperationRequest request) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(request.getArray());
        int stepNumber = 1;

        if (array.isEmpty()) {
            return steps;
        }

        VisualizationStep startStep = new VisualizationStep();
        startStep.setStepNumber(stepNumber++);
        startStep.setDescription(String.format("Starting traversal from head. Linked list has %d nodes.", array.size()));
        startStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
        startStep.setTempPointerIndex(0);
        startStep.setCurrentArray(new ArrayList<>(array));
        steps.add(startStep);

        for (int i = 0; i < array.size(); i++) {
            VisualizationStep step = new VisualizationStep();
            step.setStepNumber(stepNumber++);
            if (i < array.size() - 1) {
                step.setDescription(String.format("Node %d: value %.0f → next node", i, array.get(i)));
            } else {
                step.setDescription(String.format("Node %d: value %.0f → wraps around to head!", i, array.get(i)));
            }
            step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
            step.setTempPointerIndex(i);
            step.setCurrentArray(new ArrayList<>(array));
            steps.add(step);
        }

        VisualizationStep endStep = new VisualizationStep();
        endStep.setStepNumber(stepNumber);
        endStep.setDescription(String.format("Traversal complete! Visited all %d nodes. O(n) time complexity.", array.size()));
        endStep.setHighlightedIndices(new ArrayList<>());
        endStep.setTempPointerIndex(array.size() - 1);
        endStep.setCurrentArray(new ArrayList<>(array));
        steps.add(endStep);

        return steps;
    }
}
