package startup.vsvisualizer.service.datastructures.linkedlist.doubly.operations;

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
public class DoublyLinkedListOperations {

    public List<VisualizationStep> accessByIndex(List<Double> nodes, int targetIndex) {
        List<VisualizationStep> steps = new ArrayList<>();
        List<Double> array = copyArray(nodes);
        int stepNumber = 1;

        if (array.isEmpty() || targetIndex < 0 || targetIndex >= array.size()) {
            return steps;
        }

        boolean traverseBackwards = targetIndex > (array.size() - 1) / 2;

        if (traverseBackwards) {
            VisualizationStep startStep = new VisualizationStep();
            startStep.setStepNumber(stepNumber++);
            startStep.setDescription(String.format("Optimization: Target %d is past midpoint.\nStarting temp pointer at Tail and moving backwards!", targetIndex));
            startStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(array.size() - 1)));
            startStep.setTempPointerIndex(array.size() - 1);
            startStep.setCurrentArray(new ArrayList<>(array));
            steps.add(startStep);

            for (int i = array.size() - 1; i > targetIndex; i--) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("temp is at index [%d].\nMoving temp to prev node.", i));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                steps.add(step);
            }
        } else {
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

        boolean traverseBackwards = targetIndex > (array.size() - 1) / 2;

        if (traverseBackwards) {
            VisualizationStep startStep = new VisualizationStep();
            startStep.setStepNumber(stepNumber++);
            startStep.setDescription(String.format("Optimization: Target %d is past midpoint.\nStarting temp pointer at Tail and moving backwards!", targetIndex));
            startStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(array.size() - 1)));
            startStep.setTempPointerIndex(array.size() - 1);
            startStep.setCurrentArray(new ArrayList<>(array));
            steps.add(startStep);

            for (int i = array.size() - 1; i > targetIndex; i--) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("temp is at index [%d].\nMoving temp to prev node.", i));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                steps.add(step);
            }
        } else {
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

            VisualizationStep wirePrev = new VisualizationStep();
            wirePrev.setStepNumber(stepNumber++);
            wirePrev.setDescription("head.prev = newNode");
            wirePrev.setHighlightedIndices(new ArrayList<>(Arrays.asList(0)));
            wirePrev.setTempPointerIndex(0);
            wirePrev.setCurrentArray(new ArrayList<>(array));
            wirePrev.setFloatingNodeValue(value);
            wirePrev.setFloatingNodeLabel("New Node");
            wirePrev.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer("floating", "0", "next", false),
                new CustomPointer("0", "floating", "prev", true)
            )));
            steps.add(wirePrev);
        }

        array.add(0, value);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Node inserted at head!\nO(1) - instant pointer update.");
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
            VisualizationStep tailAccess = new VisualizationStep();
            tailAccess.setStepNumber(stepNumber++);
            tailAccess.setDescription("Direct access to Tail pointer! O(1)");
            tailAccess.setHighlightedIndices(new ArrayList<>(Arrays.asList(array.size() - 1)));
            tailAccess.setTempPointerIndex(array.size() - 1);
            tailAccess.setCurrentArray(new ArrayList<>(array));
            tailAccess.setFloatingNodeValue(value);
            tailAccess.setFloatingNodeLabel("New Node");
            steps.add(tailAccess);

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

            VisualizationStep wirePrev = new VisualizationStep();
            wirePrev.setStepNumber(stepNumber++);
            wirePrev.setDescription("newNode.prev = tail");
            wirePrev.setHighlightedIndices(new ArrayList<>(Arrays.asList(tailIdx)));
            wirePrev.setTempPointerIndex(tailIdx);
            wirePrev.setCurrentArray(new ArrayList<>(array));
            wirePrev.setFloatingNodeValue(value);
            wirePrev.setFloatingNodeLabel("New Node");
            wirePrev.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer(String.valueOf(tailIdx), "floating", "next", false),
                new CustomPointer("floating", String.valueOf(tailIdx), "prev", true)
            )));
            steps.add(wirePrev);
        }

        array.add(value);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Node inserted at tail!\nO(1) - direct tail insertion.");
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

        boolean traverseBackwards = index > (array.size() - 1) / 2 && index < array.size();

        VisualizationStep createStep = new VisualizationStep();
        createStep.setStepNumber(stepNumber++);
        createStep.setDescription(String.format("Creating new node with value %.0f", value));
        createStep.setHighlightedIndices(new ArrayList<>());
        createStep.setTempPointerIndex(traverseBackwards ? array.size() - 1 : 0);
        createStep.setCurrentArray(new ArrayList<>(array));
        createStep.setFloatingNodeValue(value);
        createStep.setFloatingNodeLabel("New Node");
        steps.add(createStep);

        if (traverseBackwards) {
            for (int i = array.size() - 1; i >= index; i--) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("At node %d: value %s → moving to prev", i, formatValue(array.get(i))));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                step.setFloatingNodeValue(value);
                step.setFloatingNodeLabel("New Node");
                steps.add(step);
            }
        } else {
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

        if (prevIdx >= 0) {
            VisualizationStep wireNewPrev = new VisualizationStep();
            wireNewPrev.setStepNumber(stepNumber++);
            wireNewPrev.setDescription(String.format("newNode.prev = node[%d]", prevIdx));
            wireNewPrev.setHighlightedIndices(new ArrayList<>(Arrays.asList(prevIdx)));
            wireNewPrev.setTempPointerIndex(index);
            wireNewPrev.setCurrentArray(new ArrayList<>(array));
            wireNewPrev.setFloatingNodeValue(value);
            wireNewPrev.setFloatingNodeLabel("New Node");
            List<CustomPointer> ptrs = new ArrayList<>();
            if (index < array.size()) {
                ptrs.add(new CustomPointer("floating", nextNodeId, "next", false));
            }
            ptrs.add(new CustomPointer(String.valueOf(prevIdx), "floating", "next", false));
            ptrs.add(new CustomPointer("floating", String.valueOf(prevIdx), "prev", true));
            wireNewPrev.setCustomPointers(ptrs);
            steps.add(wireNewPrev);
        }

        if (index < array.size()) {
            VisualizationStep wireCurrPrev = new VisualizationStep();
            wireCurrPrev.setStepNumber(stepNumber++);
            wireCurrPrev.setDescription(String.format("node[%d].prev = newNode", index));
            wireCurrPrev.setHighlightedIndices(new ArrayList<>(Arrays.asList(index)));
            wireCurrPrev.setTempPointerIndex(index);
            wireCurrPrev.setCurrentArray(new ArrayList<>(array));
            wireCurrPrev.setFloatingNodeValue(value);
            wireCurrPrev.setFloatingNodeLabel("New Node");
            List<CustomPointer> ptrs = new ArrayList<>();
            ptrs.add(new CustomPointer("floating", nextNodeId, "next", false));
            if (prevIdx >= 0) {
                ptrs.add(new CustomPointer(String.valueOf(prevIdx), "floating", "next", false));
                ptrs.add(new CustomPointer("floating", String.valueOf(prevIdx), "prev", false));
            }
            ptrs.add(new CustomPointer(nextNodeId, "floating", "prev", true));
            wireCurrPrev.setCustomPointers(ptrs);
            steps.add(wireCurrPrev);
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

            VisualizationStep wirePrev = new VisualizationStep();
            wirePrev.setStepNumber(stepNumber++);
            wirePrev.setDescription("newHead.prev = null");
            wirePrev.setHighlightedIndices(new ArrayList<>(Arrays.asList(1)));
            wirePrev.setTempPointerIndex(1);
            wirePrev.setCurrentArray(new ArrayList<>(array));
            wirePrev.setFloatingNodeValue(deletedValue);
            wirePrev.setFloatingNodeLabel("Deleted");
            steps.add(wirePrev);
        }

        array.remove(0);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Head deleted!\nO(1) - instant pointer update.");
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
            VisualizationStep optStep = new VisualizationStep();
            optStep.setStepNumber(stepNumber++);
            optStep.setDescription("Direct Tail access! Using tail.prev to find second-to-last O(1)");
            optStep.setHighlightedIndices(new ArrayList<>(Arrays.asList(tailIdx, tailIdx - 1)));
            optStep.setTempPointerIndex(tailIdx - 1);
            optStep.setCurrentArray(new ArrayList<>(array));
            steps.add(optStep);

            int prevIdx = tailIdx - 1;
            VisualizationStep wireNext = new VisualizationStep();
            wireNext.setStepNumber(stepNumber++);
            wireNext.setDescription("prevNode.next = null");
            wireNext.setHighlightedIndices(new ArrayList<>(Arrays.asList(prevIdx)));
            wireNext.setTempPointerIndex(prevIdx);
            wireNext.setCurrentArray(new ArrayList<>(array));
            wireNext.setFloatingNodeValue(deletedValue);
            wireNext.setFloatingNodeLabel("Deleted");
            steps.add(wireNext);
        }

        array.remove(tailIdx);
        VisualizationStep finalStep = new VisualizationStep();
        finalStep.setStepNumber(stepNumber);
        finalStep.setDescription("Tail deleted!\nO(1) - instantly found prev node.");
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
        boolean traverseBackwards = index > (array.size() - 1) / 2;

        if (traverseBackwards) {
            for (int i = array.size() - 1; i >= index; i--) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("At node %d: value %s → moving to prev", i, formatValue(array.get(i))));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                steps.add(step);
            }
        } else {
            for (int i = 0; i <= index; i++) {
                VisualizationStep step = new VisualizationStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(String.format("At node %d: value %s", i, formatValue(array.get(i))));
                step.setHighlightedIndices(new ArrayList<>(Arrays.asList(i)));
                step.setTempPointerIndex(i);
                step.setCurrentArray(new ArrayList<>(array));
                steps.add(step);
            }
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

            VisualizationStep wirePrevBypass = new VisualizationStep();
            wirePrevBypass.setStepNumber(stepNumber++);
            wirePrevBypass.setDescription(String.format("node[%d].prev = node[%d] (bypass backwards)", nextIdx, prevIdx));
            wirePrevBypass.setHighlightedIndices(new ArrayList<>(Arrays.asList(nextIdx)));
            wirePrevBypass.setTempPointerIndex(nextIdx);
            wirePrevBypass.setCurrentArray(new ArrayList<>(array));
            wirePrevBypass.setFloatingNodeValue(deletedValue);
            wirePrevBypass.setFloatingNodeLabel("Deleted");
            wirePrevBypass.setCustomPointers(new ArrayList<>(Arrays.asList(
                new CustomPointer(String.valueOf(prevIdx), String.valueOf(nextIdx), "next", false),
                new CustomPointer(String.valueOf(nextIdx), String.valueOf(prevIdx), "prev", true)
            )));
            steps.add(wirePrevBypass);
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
                step.setDescription(String.format("Node %d: value %.0f → null (end of list)", i, array.get(i)));
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
