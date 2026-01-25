import type { Component } from "solid-js";
import type { TimelineItem } from "../types";

type TimelineCardProps = {
  item: TimelineItem;
};

export const TimelineCard: Component<TimelineCardProps> = (props) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
    });
  };

  const formatDateRange = () => {
    const start = formatDate(props.item.startDate);
    if (props.item.endDate) {
      return `${start} - ${formatDate(props.item.endDate)}`;
    }
    return `${start} - Présent`;
  };

  return (
    <div class="timeline-box card bg-base-200 shadow-xl w-full max-w-md">
      <div class="card-body p-6">
        <div class="mb-3">
          <time class="font-mono text-xs italic text-base-content/70">
            {formatDateRange()}
          </time>
          <h3 class="mt-1 text-xl font-black">{props.item.title}</h3>
          <div class="mt-1 text-base font-semibold text-primary">
            {props.item.entity}
          </div>
          <div class="mt-1 text-sm text-base-content/70">
            {props.item.location}
          </div>
        </div>
        <p class="text-sm leading-relaxed text-base-content/90">
          {props.item.description}
        </p>
        {props.item.technologies && props.item.technologies.length > 0 && (
          <div class="mt-4 flex flex-wrap gap-2">
            {props.item.technologies.map((tech) => (
              <span class="badge badge-primary badge-sm">{tech}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
