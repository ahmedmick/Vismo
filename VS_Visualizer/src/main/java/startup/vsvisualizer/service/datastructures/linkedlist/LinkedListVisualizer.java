package startup.vsvisualizer.service.datastructures.linkedlist;

import startup.vsvisualizer.dto.datastructures.array.ArrayOperationRequest;
import startup.vsvisualizer.entity.visualization.VisualizationStep;

import java.util.List;

/**
 * Type-specific linked list visualization (one implementation per {@link LinkedListType}).
 */
public interface LinkedListVisualizer {

    LinkedListType getType();

    List<VisualizationStep> accessByIndex(List<Double> nodes, int targetIndex, String listType);

    List<VisualizationStep> updateAtPosition(ArrayOperationRequest request);

    List<VisualizationStep> insertAtHead(ArrayOperationRequest request);

    List<VisualizationStep> insertAtTail(ArrayOperationRequest request);

    List<VisualizationStep> insertAtPosition(ArrayOperationRequest request);

    List<VisualizationStep> deleteAtHead(ArrayOperationRequest request);

    List<VisualizationStep> deleteAtTail(ArrayOperationRequest request);

    List<VisualizationStep> deleteAtPosition(ArrayOperationRequest request);

    List<VisualizationStep> searchForValue(ArrayOperationRequest request);

    List<VisualizationStep> traverseTheArray(ArrayOperationRequest request);
}
