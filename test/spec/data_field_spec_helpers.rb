module DataFieldSpecHelpers
  def answer_data_field(answer)
    wait_for_selector('#task__response-input').send_keys(answer)
    wait_for_selector('.task__save').click
  end

  def answer_data_field_new(answer)
    wait_for_selector('#metadata-input').send_keys(answer)
    wait_for_selector('.metadata-save').click
  end

  def edit_data_field_response(answer)
    wait_for_selector('.task-actions__icon').click
    wait_for_selector('.task-actions__edit-response').click
    answer_data_field(answer)
    wait_for_selector_none('.task__cancel')
  end

  def edit_data_field_response_new(answer)
    wait_for_selector('.metadata-edit').click
    answer_data_field_new(answer)
    wait_for_selector_none('.metdata-cancel')
  end

  def delete_data_field_response
    wait_for_selector('.task-actions__icon').click
    wait_for_selector('.task-actions__delete-response').click
    wait_for_selector('.confirm-proceed-dialog__proceed').click
    wait_for_selector_none('.confirm-proceed-dialog__cancel')
  end

  def delete_data_field_response_new
    wait_for_selector('.metadata-delete').click
    wait_for_selector_none('.metadata-delete')
  end

  def edit_data_field(new_task_name)
    wait_for_selector('.create-task__add-button')
    wait_for_selector('.task-actions__icon').click
    wait_for_selector('.task-actions__edit').click
    wait_for_selector("//span[contains(text(), 'Cancel')]", :xpath)
    update_field('#task-label-input', new_task_name)
    wait_for_selector('.create-task__dialog-submit-button').click
    wait_for_selector_none("//span[contains(text(), 'Cancel')]", :xpath)
  end

  def delete_data_field
    wait_for_selector('.task')
    wait_for_selector('.task-actions__icon').click
    wait_for_selector('.task-actions__delete').click
    wait_for_selector('.confirm-proceed-dialog__proceed').click
    wait_for_selector_none('.confirm-proceed-dialog__cancel')
  end
end
